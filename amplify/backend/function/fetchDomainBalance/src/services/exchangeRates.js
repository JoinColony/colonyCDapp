const CoinGeckoConfig = require('../config/coinGeckoConfig');
const NetworkConfig = require('../config/networkConfig');
const { getFiatExchangeRate } = require('../api/rest/getFiatExchangeRate');
const { getTokensList } = require('../api/rest/getTokensList');
const {
  getExchangeRate,
  saveExchangeRate,
} = require('../api/graphql/operations');
const { getStartOfDayFor } = require('../utils');
const {
  SupportedCurrencies,
  CHAIN_ID_TO_SUPPORTED_NETWORK,
} = require('../consts');

const { constants: ethersConstants, utils: ethersUtils } = require('ethers');

const ADDRESS_ZERO = ethersConstants.AddressZero;

const isDev = process.env.ENV === 'dev';

const ExchangeRatesService = (() => {
  const exchangeRates = {};
  let apiTokenIdsData = null;

  const saveEntryToDB = async ({ tokenId, date, marketPrice }) => {
    const { mappings } = await CoinGeckoConfig.getConfig();

    const marketPriceToArrayAndSupportedCurrency =
      Object.keys(marketPrice)
        .map((marketPriceCurrency) => {
          const supportedCurrencyEntry = Object.entries(
            mappings.currencies,
          ).find(([, value]) => value === marketPriceCurrency);

          if (!supportedCurrencyEntry) {
            return null;
          }

          return {
            currency: supportedCurrencyEntry?.[0],
            rate: marketPrice[marketPriceCurrency],
          };
        })
        .filter((entry) => !!entry) ?? [];

    return saveExchangeRate({
      tokenId,
      date,
      marketPrice: marketPriceToArrayAndSupportedCurrency,
    });
  };

  const getUniqueDates = (dates) => {
    const uniqueDatesSet = new Set();

    dates.forEach((date) => {
      const uniqueDate = getStartOfDayFor(date);
      uniqueDatesSet.add(uniqueDate);
    });

    return [...uniqueDatesSet];
  };

  const getApiTokenIdFromAddress = async ({
    tokenAddress,
    supportedNetwork,
  }) => {
    const { mappings } = await CoinGeckoConfig.getConfig();
    const { DEFAULT_NETWORK_TOKEN } = await NetworkConfig.getConfig();

    if (tokenAddress === ADDRESS_ZERO) {
      return mappings.networkTokens[DEFAULT_NETWORK_TOKEN.symbol];
    }

    const tokenAddressRegEx = new RegExp(`^${tokenAddress}$`, 'i');

    try {
      const chain = mappings.chains[supportedNetwork] ?? supportedNetwork;
      if (!apiTokenIdsData) {
        apiTokenIdsData = await getTokensList();
      }
      const token = apiTokenIdsData.find((coinItem) =>
        tokenAddressRegEx.test(coinItem?.platforms?.[chain]),
      );

      return token?.id;
    } catch {
      return null;
    }
  };

  const getExchangeRatesForToken = async ({
    tokenAddress,
    currency,
    supportedNetwork,
    dates,
  }) => {
    const tokenId = await getApiTokenIdFromAddress({
      tokenAddress,
      supportedNetwork,
    });
    const tokenExchangeRate = {};
    const uniqueDates = getUniqueDates(dates);

    console.log(`Token id ${tokenId} for address ${tokenAddress}`);

    if (tokenId) {
      const exchangeRateRequests = [];

      uniqueDates.forEach((date) =>
        exchangeRateRequests.push(getExchangeRate({ tokenId, date })),
      );

      const exchangeRateData = await Promise.all(exchangeRateRequests);
      const exchangeRatesFromDB = exchangeRateData.filter((data) => !!data);

      exchangeRatesFromDB
        .map(({ date, marketPrice }) => ({
          date,
          rate: marketPrice.find(
            (marketPriceEntry) => marketPriceEntry.currency === currency,
          )?.rate,
        }))
        .filter(({ rate }) => rate !== undefined)
        .forEach(({ date, rate }) => {
          tokenExchangeRate[date] = rate;
        });
    } else {
      uniqueDates.forEach((date) => {
        tokenExchangeRate[date] = isDev ? 1 : 0;
      });
    }

    /**
     * If number of exchange rates in DB is different than the number of days
     * we need to call Coin Gecko API and store values to DB
     */
    const existingDatesInDB = Object.keys(tokenExchangeRate);
    const shouldFetchValuesFromAPI =
      existingDatesInDB.length !== uniqueDates.length;

    if (shouldFetchValuesFromAPI) {
      const missingDates = uniqueDates.filter(
        (date) => !existingDatesInDB.includes(date),
      );

      console.log(
        `Exchange rates missing for ${missingDates.length} days`,
        JSON.stringify(missingDates),
      );

      let exchangeRatesFromAPI = [];

      try {
        exchangeRatesFromAPI = await Promise.all(
          missingDates.map((missingDate) =>
            getFiatExchangeRate(tokenId, missingDate),
          ),
        );
      } catch (e) {
        console.error(
          `Error while fetching data from API for token with id ${tokenId}`,
          JSON.stringify(e),
        );
      }

      await Promise.all(
        missingDates.map((missingDate, index) => {
          const marketPrice =
            exchangeRatesFromAPI[index]?.market_data?.current_price;

          tokenExchangeRate[missingDate] =
            marketPrice?.[currency.toLowerCase()] ?? (isDev ? 1 : 0);

          if (marketPrice) {
            return saveEntryToDB({
              tokenId,
              date: missingDate,
              marketPrice,
            });
          }
        }),
      );
    }

    return [tokenAddress, tokenExchangeRate];
  };

  return {
    getExchangeRates: async (tokens, currency) => {
      const { supportedNetwork: defaultSupportedNetwork } =
        await NetworkConfig.getConfig();
      const tokensExchangeRate = await Promise.all(
        Object.entries(tokens).map(async ([tokenAddressChainId, dates]) => {
          const [chainId, tokenAddress] = tokenAddressChainId.split('_');
          let checksummedTokenAddress = tokenAddress;

          if (ethersUtils.isAddress(tokenAddress)) {
            checksummedTokenAddress = ethersUtils.getAddress(tokenAddress);
          }

          let supportedNetworkFromChainId;
          if (chainId) {
            supportedNetworkFromChainId =
              CHAIN_ID_TO_SUPPORTED_NETWORK[chainId];
          }

          return getExchangeRatesForToken({
            tokenAddress: checksummedTokenAddress,
            currency: currency ?? SupportedCurrencies.USD,
            supportedNetwork:
              supportedNetworkFromChainId ?? defaultSupportedNetwork,
            dates,
          });
        }),
      );

      tokensExchangeRate.forEach(([tokenAddress, tokenExchangeRate]) => {
        exchangeRates[tokenAddress] = tokenExchangeRate;
      });

      return exchangeRates;
    },
  };
})();

module.exports = ExchangeRatesService;
