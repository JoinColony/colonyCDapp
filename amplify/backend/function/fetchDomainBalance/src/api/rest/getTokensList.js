const { buildAPIEndpoint } = require('./utils');
const CoinGeckoConfig = require('../../config/coinGeckoConfig');

const getTokensList = async () => {
    const { apiKey, api } = await CoinGeckoConfig.getConfig();
    const { url, searchParams } =  api.endpoints.coinList;

    const urlWithSearchParams = buildAPIEndpoint(
        new URL(url), {
        [searchParams.api]: apiKey ?? '',
    })
    const response = await fetch(urlWithSearchParams)
    const data = await response.json()

    return data;
}

module.exports = {
    getTokensList
};