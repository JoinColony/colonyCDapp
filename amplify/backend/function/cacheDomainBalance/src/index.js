require('cross-fetch/polyfill');

const {
  getAllColonies,
  getDomains,
  processInBatches,
} = require('./api/graphql/operations');
const { getWeeksFromNow, getDaysFromNow, TimeframeType } = require('./utils');
const CacheBalanceFactory = require('./config/cacheBalance');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  /**
   * We want to get the start of day for the previous 30 days
   */
  const startOfLast30DaysDate = getDaysFromNow(30);
  /**
   * We want to get the start of last week
   */
  const startOfLastWeekDate = getWeeksFromNow(1);

  try {
    const colonies = await getAllColonies();

    const processBalanceRequests = [];

    colonies.forEach((colony) => {
      processBalanceRequests.push(
        CacheBalanceFactory.processBalanceForPeriod({
          colonyAddress: colony.id,
          timeframePeriod: 1,
          timeframeType: TimeframeType.TOTAL,
          endOfPeriodDate: startOfLastWeekDate,
        }),
      );
      processBalanceRequests.push(
        CacheBalanceFactory.processBalanceForPeriod({
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
          CacheBalanceFactory.processBalanceForPeriod({
            colonyAddress,
            domainId,
            timeframePeriod: 1,
            timeframeType: TimeframeType.TOTAL,
            endOfPeriodDate: startOfLastWeekDate,
          }),
        );
        processBalanceRequests.push(
          CacheBalanceFactory.processBalanceForPeriod({
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
      statusCode: 200,
    };
  } catch (e) {
    console.log('there was an error', e);
    console.error(e);

    return {
      statusCode: 400,
    };
  }
};
