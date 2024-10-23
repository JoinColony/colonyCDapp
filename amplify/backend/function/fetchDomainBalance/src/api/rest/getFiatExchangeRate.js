const { buildAPIEndpoint } = require('./utils');
const CoinGeckoConfig = require('../../config/coinGeckoConfig');
const { format } = require('date-fns')

const getDateSearchParamValue = (date) => format(new Date(date), 'dd-MM-yyyy')

const getFiatExchangeRate = async (tokenId, date) => {
    const { apiKey, api } = await CoinGeckoConfig.getConfig();
    const { url, searchParams } = api.endpoints.tokenHistoricalPriceByName;

    const urlWithSearchParams = buildAPIEndpoint(
        new URL(`${url}/${tokenId}/history`), {
        [searchParams.api]: apiKey ?? '',
        [searchParams.date]: getDateSearchParamValue(date),
    })

    const result = await fetch(urlWithSearchParams)
    const data = await result.json();

    return data;
}

module.exports = {
    getFiatExchangeRate
};