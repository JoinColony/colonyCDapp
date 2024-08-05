require('cross-fetch/polyfill');

const {
    utils: { Logger },
} = require('ethers');
const { getPeriodFromNow, getDaysFromNow } = require('./utils');
const ExchangeRatesFactory = require('./config/exchangeRates');
const { getInOutActions, getTokensDatesMap, filterActionsWithinTimeframe, updatePeriodBalance, update30DaysBalance } = require('./services/actions');
const { getTotalFiatAmountFor } = require('./services/tokens');
Logger.setLogLevel(Logger.levels.ERROR);

// @TODO maybe rename the lambda function

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    try {
        const { colonyAddress, domainAddress, chainId, selectedCurrency, timeframePeriod = 4, timeframeType } = event.arguments?.input || {};
        const periodFromNow = getPeriodFromNow(timeframePeriod, timeframeType);
        const last30Days = getDaysFromNow(30);

        const inOutActions = await getInOutActions(colonyAddress, domainAddress);
        const inOutActionsWithinTimeframe = filterActionsWithinTimeframe(inOutActions, periodFromNow);
        const periodBalance = updatePeriodBalance(timeframeType, timeframePeriod, inOutActionsWithinTimeframe, domainAddress);

        const last30DaysActions = filterActionsWithinTimeframe(inOutActions, last30Days);
        const last30DaysBalance = update30DaysBalance(last30DaysActions, domainAddress);

        const exchangeRates = await ExchangeRatesFactory.getExchangeRates(getTokensDatesMap(inOutActionsWithinTimeframe), selectedCurrency, chainId);

        const inOutPeriodBalance = {};

        for (let period in periodBalance) {
            const balance = periodBalance[period];
            const totalIn = await getTotalFiatAmountFor(balance.in, exchangeRates);
            const totalOut = await getTotalFiatAmountFor(balance.out, exchangeRates);
            inOutPeriodBalance[period] = {
                totalIn,
                totalOut,
            };
        }

        const last30DaysBalanceTotalIn = await getTotalFiatAmountFor(last30DaysBalance.in, exchangeRates);
        const last30DaysBalanceTotalOut = await getTotalFiatAmountFor(last30DaysBalance.out, exchangeRates);

        return {
            last30Days: {
                totalIn: last30DaysBalanceTotalIn,
                totalOut: last30DaysBalanceTotalOut
            },
            timeframe: Object.keys(inOutPeriodBalance).map((period) => ({
                key: period,
                value: inOutPeriodBalance[period]
            }))
        };
    } catch (e) {
        console.log('there was an error', e)
        console.error(e);
    }
};
