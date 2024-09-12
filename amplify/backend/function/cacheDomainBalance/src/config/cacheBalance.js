const {
  computePreviousBalance,
  getPreviousBalance,
  savePreviousBalance,
  updatePreviousBalance,
} = require('../api/graphql/requests');
const { isSameDay, TimeframeType } = require('../utils');

const CacheBalanceFactory = (() => {
  const upsertBalance = async ({
    previousBalanceData,
    computedBalance,
    colonyAddress,
    domainId,
    timeframePeriod,
    timeframeType,
    endOfPeriodDate,
  }) => {
    const inputData = {
      date: endOfPeriodDate,
      colonyAddress,
      domainId,
      timeframePeriod,
      timeframeType,
      totalIn: computedBalance.totalIn,
      totalOut: computedBalance.totalOut,
    };

    /**
     * If there is a previousBalanceData.id, we only need to update the entry
     * Otherwise, we need to create a new entry
     */
    if (previousBalanceData?.id) {
      await updatePreviousBalance({
        ...inputData,
        id: previousBalance.id,
      });
    } else {
      await savePreviousBalance(inputData);
    }
  };

  return {
    processBalanceForPeriod: async ({
      colonyAddress,
      domainId,
      timeframePeriod,
      timeframeType = TimeframeType.DAILY,
      endOfPeriodDate,
    }) => {
      /**
       * Check if we already have a cached value for this timeframe period and type
       */
      const previousBalanceData = await getPreviousBalance({
        colonyAddress,
        domainId,
        timeframePeriod,
        timeframeType,
      });

      /**
       * Check if the cached data is for the same day as the endOfPeriodDate
       * If yes, we can early return from the function
       */
      if (isSameDay(previousBalanceData?.date, endOfPeriodDate)) {
        return;
      }

      /**
       * Compute the balance for this period
       */
      const computedBalance = await computePreviousBalance({
        colonyAddress,
        domainId,
        timeframePeriod,
        timeframeType,
        timeframePeriodEndDate: endOfPeriodDate,
      });

      /**
       * We need to store the balance
       */
      if (computedBalance) {
        await upsertBalance({
          previousBalanceData,
          computedBalance,
          colonyAddress,
          domainId,
          timeframePeriod,
          timeframeType,
          endOfPeriodDate,
        });
      }
    },
  };
})();

module.exports = CacheBalanceFactory;
