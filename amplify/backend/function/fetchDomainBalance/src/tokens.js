const { BigNumber, constants: ethersContants } = require('ethers');

const fetch = require('cross-fetch');

const { formatISO, startOfDay, format } = require('date-fns')

const { getExchangeRate, saveExchangeRate } = require('./queries');
const { buildAPIEndpoint } = require('./utils');
const { SupportedNetwork, SupportedCurrencies, DEFAULT_NETWORK_TOKEN, coinGeckoMappings, currencyApiConfig, COINGECKO_API_KEY } = require('./config');

const isDev = process.env.ENV === 'dev';

const ADDRESS_ZERO = ethersContants.AddressZero;

const { chains, currencies } = coinGeckoMappings;

const getStartOfDayFor = (date) =>
    formatISO(new Date(startOfDay(new Date(date))))

const getDateSearchParamValue = (date) => format(new Date(date), 'dd-MM-yyyy')

const fetchValueFromAPI = async (tokenId, date) => {
    const { url, searchParams } = currencyApiConfig.endpoints.tokenHistoricalPriceByName;

    const urlWithSearchParams = buildAPIEndpoint(
        new URL(`${url}/${tokenId}/history`), {
        [searchParams.api]: COINGECKO_API_KEY ?? '',
        [searchParams.date]: getDateSearchParamValue(date),
    }
    )

    return fetch(urlWithSearchParams)
}

const saveEntryToDB = async ({ tokenId, date, marketPrice }) => {
    const marketPriceToArrayAndSupportedCurrency = Object.keys(marketPrice).map(marketPriceCurrency => {
        const supportedCurrencyEntry = Object.entries(currencies).find(([, value]) => value === marketPriceCurrency);

        if (!supportedCurrencyEntry) {
            return null
        }

        return {
            currency: supportedCurrencyEntry?.[0],
            rate: marketPrice[marketPriceCurrency]
        };
    }).filter(entry => !!entry) ?? [];

    return saveExchangeRate({
        tokenId,
        date,
        marketPrice: marketPriceToArrayAndSupportedCurrency
    })
};

const getTokenIdFromAddress = async ({ tokenAddress, chainId }) => {
    if (tokenAddress === ADDRESS_ZERO) {
        return coinGeckoMappings.networkTokens[DEFAULT_NETWORK_TOKEN.symbol];
    }

    try {
        const chain = chains[chainId] ?? chainId;

        const coinListResponse = await fetch(currencyApiConfig.endpoints.coinList)
        const coinListData = await coinListResponse.json()

        const coin = coinListData.find(coinItem => coinItem?.platforms?.[chain] === tokenAddress);

        return coin?.id;
    } catch {
        return null;
    }
};

// this should be replaced by a proper table lookup with token address as index and date as sort key
const getExchangeRatesForToken = async ({
    tokenAddress,
    currency = SupportedCurrencies.USD,
    chainId = SupportedNetwork.Mainnet,
    dates
}) => {
    const tokenId = await getTokenIdFromAddress({ tokenAddress, chainId })
    console.log(tokenId);

    const exchangeRateRequests = [];

    const uniqueDatesSet = new Set();

    dates.forEach(date => {
        const uniqueDate = getStartOfDayFor(date);
        uniqueDatesSet.add(uniqueDate);
    })

    const uniqueDates = [...uniqueDatesSet];
    uniqueDates.forEach(date => exchangeRateRequests.push(getExchangeRate({ tokenId, date })))

    const exchangeRateData = await Promise.all(exchangeRateRequests);
    const exchangeRatesFromDB = exchangeRateData.filter(data => !!data);

    const tokenExchangeRate = {};

    exchangeRatesFromDB.forEach(({ date, marketPrice }) => {
        tokenExchangeRate[date] = marketPrice.find((marketPriceEntry) => marketPriceEntry.currency === currency)?.rate;
    })

    /**
     * If number of exchange rates in DB is different than the number of days
     * we need to call Coin Gecko API and store values to DB
     */
    const shouldFetchValuesFromAPI = exchangeRatesFromDB.length !== uniqueDates.length;

    if (shouldFetchValuesFromAPI) {
        const existingDatesInDb = exchangeRatesFromDB.map(exchangeRateFromDB => exchangeRateFromDB.date);
        const missingDates = uniqueDates.filter(date => !existingDatesInDb.includes(date));

        console.log(`Exchange rates missing for ${missingDates.length} days`, JSON.stringify(missingDates))

        let exchangeRatesFromAPI = [];

        try {
            exchangeRatesFromAPI = await Promise
                .all(
                    missingDates.map(missingDate => fetchValueFromAPI(tokenId, missingDate))
                )
                .then(responses =>
                    Promise.all(responses.map(response => response.json()))
                )

        } catch (e) {
            console.error(`Error while fetching data from API for token with id ${tokenId}`, JSON.stringify(e))
        }

        await Promise.all(
            missingDates.map((missingDate, index) => {
                const marketPrice = exchangeRatesFromAPI[index]?.market_data?.current_price;

                tokenExchangeRate[missingDate] = marketPrice?.[currency.toLowerCase()] ?? (isDev ? 1 : 0);

                if (marketPrice) {
                    return saveEntryToDB({
                        tokenId,
                        date: missingDate,
                        marketPrice
                    })
                }
            })
        )

    }

    return [tokenAddress, tokenExchangeRate];
};


const getExchangeRatesFor = async ({
    tokens,
    currency = SupportedCurrencies.USD,
    chainId = SupportedNetwork.Mainnet,
}) => {
    const exchangeRates = {};

    const tokensExchangeRate = await Promise.all(
        Object.entries(tokens).map(async ([tokenAddress, dates]) => {
            return getExchangeRatesForToken({ tokenAddress, currency, dates, chainId })
        })
    )

    tokensExchangeRate.forEach(([tokenId, tokenExchangeRate]) => {
        exchangeRates[tokenId] = tokenExchangeRate;
    })

    return exchangeRates;

};

const getConvertedTokenAmount = (amount, decimals, exchangeRate) => {
    const tokenScaleFactor = BigNumber.from(10).pow(decimals);
    const exchangeRateDecimals = 9;
    const normalizedTokenExchangeRate = BigNumber.from(Math.round(exchangeRate * Math.pow(10, exchangeRateDecimals)));

    return BigNumber
        .from(amount)
        .div(tokenScaleFactor)
        .mul(normalizedTokenExchangeRate)
        .div(BigNumber.from(10).pow(exchangeRateDecimals));
}

const getTotalConvertedAmountFor = (items, exchangeRates) => {
    let totalAmount = BigNumber.from(0);
    for (let item of items) {
        // TODO need to check if networkFee needs to be taken into account
        const { amount, networkFee, token, finalizedDate } = item;
        const tokenId = token.id;
        const date = getStartOfDayFor(finalizedDate);
        const tokenExchangeRate = exchangeRates[tokenId][date];

        // TODO need to check if operation is legit
        const convertedTokenValue = getConvertedTokenAmount(amount, token.decimals, tokenExchangeRate);

        totalAmount = totalAmount.add(convertedTokenValue)
    }

    return totalAmount.toString();
};

module.exports = {
    getTotalConvertedAmountFor,
    getExchangeRatesFor,
};

