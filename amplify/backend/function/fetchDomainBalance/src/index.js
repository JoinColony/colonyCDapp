require('cross-fetch/polyfill');

const {
  BigNumber,
  utils: { Logger },
} = require('ethers');
const { getPeriodFor, shouldFetchNetworkBalance } = require('./utils');
const {
  getInOutActions,
  getTokensDatesMap,
  filterActionsWithinTimeframe,
  groupBalanceByPeriod,
} = require('./services/actions');
const ExchangeRatesService = require('./services/exchangeRates');
const { getTotalFiatAmountFor } = require('./services/tokens');
const { getNetworkTotalBalance } = require('./services/networkBalance');
Logger.setLogLevel(Logger.levels.ERROR);

// @TODO maybe rename the lambda function

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  try {
    const {
      colonyAddress,
      domainId,
      selectedCurrency,
      timeframePeriod = 4,
      timeframeType,
      timeframePeriodEndDate,
    } = event.arguments?.input || {};

    /**
     * We want to early return if there is no positive period for which to compute values
     */
    if (timeframePeriod <= 0) {
      return {
        totalIn: 0,
        totalOut: 0,
        total: 0,
        timeframe: [],
      };
    }

    const periodForTimeframe = getPeriodFor(
      timeframePeriod,
      timeframeType,
      timeframePeriodEndDate,
    );

    console.log(
      `Date for ${timeframePeriod} timeframe, ` +
        `${timeframeType} type, and ` +
        `${timeframePeriodEndDate} end date: ` +
        `${periodForTimeframe}`,
    );

    const inOutActions = await getInOutActions(colonyAddress, domainId);
    const inOutActionsWithinTimeframe = filterActionsWithinTimeframe(
      inOutActions,
      periodForTimeframe,
      timeframePeriodEndDate,
    );
    const periodBalance = groupBalanceByPeriod(
      timeframeType,
      timeframePeriod,
      timeframePeriodEndDate,
      inOutActionsWithinTimeframe,
      domainId,
    );
    const exchangeRates = await ExchangeRatesService.getExchangeRates(
      getTokensDatesMap(inOutActionsWithinTimeframe),
      selectedCurrency,
    );

    const inOutPeriodBalance = {};
    let timeframeTotalIn = BigNumber.from(0);
    let timeframeTotalOut = BigNumber.from(0);

    for (let period in periodBalance) {
      const balance = periodBalance[period];
      const totalIn = await getTotalFiatAmountFor(balance.in, exchangeRates);
      const totalOut = await getTotalFiatAmountFor(balance.out, exchangeRates);
      const totalInBN = BigNumber.from(totalIn);
      const totalOutBN = BigNumber.from(totalOut);

      inOutPeriodBalance[period] = {
        totalIn,
        totalOut,
        total: totalInBN.sub(totalOutBN).toString(),
      };

      timeframeTotalIn = timeframeTotalIn.add(totalInBN);
      timeframeTotalOut = timeframeTotalOut.add(totalOutBN);
    }

    if (shouldFetchNetworkBalance(timeframeType)) {
      const total = await getNetworkTotalBalance({
        colonyAddress,
        timeframePeriodEndDate,
        domainId,
        selectedCurrency,
      });
      return {
        totalIn: timeframeTotalIn.toString(),
        totalOut: timeframeTotalOut.toString(),
        total: total,
        timeframe: [],
      };
    }

    return {
      totalIn: timeframeTotalIn.toString(),
      totalOut: timeframeTotalOut.toString(),
      total: timeframeTotalIn.sub(timeframeTotalOut).toString(),
      timeframe: Object.keys(inOutPeriodBalance).map((period) => ({
        key: period,
        value: inOutPeriodBalance[period],
      })),
    };
  } catch (e) {
    console.log('there was an error', e);
    console.error(e);
  }
};
