require('cross-fetch/polyfill');

const {
  getAllColonies,
  getDomains,
  processInBatches,
} = require('./api/graphql/operations');
const {
  subtractWeeksFromNow,
  subtractDaysFromNow,
  TimeframeType,
} = require('./utils');
const CacheBalanceService = require('./service/cacheBalance');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  /**
   * We want to get the start of day for the previous 30 days
   */
  const startOfLast30DaysDate = subtractDaysFromNow(30);
  /**
   * We want to get the start of last week
   */
  const startOfLastWeekDate = subtractWeeksFromNow(1);

  try {
    const colonies = await getAllColonies();

    const processBalanceRequests = [];

    colonies.forEach((colony) => {
      processBalanceRequests.push(
        CacheBalanceService.processBalanceForPeriod({
          colonyAddress: colony.id,
          timeframePeriod: 1,
          timeframeType: TimeframeType.TOTAL,
          endOfPeriodDate: startOfLastWeekDate,
        }),
      );
      processBalanceRequests.push(
        CacheBalanceService.processBalanceForPeriod({
          colonyAddress: colony.id,
          timeframePeriod: 30,
          timeframeType: TimeframeType.DAILY,
          endOfPeriodDate: startOfLast30DaysDate,
        }),
      );
    });

    const coloniesDomains = await Promise.all(
      colonies.map((colony) => {
        return getDomains(colony.id);
      }),
    );

    const domains = coloniesDomains.flat();

    for (domain of domains) {
      if (domain) {
        const { id: domainId, colonyId: colonyAddress } = domain ?? {};
        processBalanceRequests.push(
          CacheBalanceService.processBalanceForPeriod({
            colonyAddress,
            domainId,
            timeframePeriod: 1,
            timeframeType: TimeframeType.TOTAL,
            endOfPeriodDate: startOfLastWeekDate,
          }),
        );
        processBalanceRequests.push(
          CacheBalanceService.processBalanceForPeriod({
            colonyAddress,
            domainId,
            timeframePeriod: 30,
            timeframeType: TimeframeType.DAILY,
            endOfPeriodDate: startOfLast30DaysDate,
          }),
        );
      }
    }

    /**
     * We'll process the balance requests in batches to not overflow the lambda's memory
     */
    const batchSize = 20;
    await processInBatches(processBalanceRequests, batchSize);

    return {
      success: true,
    };
  } catch (e) {
    console.log('there was an error', e);
    console.error(e);

    return {
      success: false,
    };
  }
};
