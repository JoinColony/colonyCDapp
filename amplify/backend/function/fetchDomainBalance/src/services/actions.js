const {
  getAllActions,
  getAllExpenditures,
  getDomains,
  getAllIncomingFunds,
  getTokensDecimalsFor,
} = require('../api/graphql/operations');
const {
  getActionWithFinalizedDate,
  getFormattedIncomingFunds,
  getFormattedExpenditures,
  getTokenAddressesFromExpenditures,
  getPeriodFormat,
  getPeriodFor,
  isAfter,
  isBefore,
} = require('../utils');

const getInOutActions = async (colonyAddress, parentDomainId) => {
  /**
   * @TODO also get child domains for which we should do operations recursively
   * however if financial actions have been executed between children of same domainAddress they shouldn't be taken into account
   */
  /**
   * @TODO filter child domains for colonyAddress and parentDomainId
   */
  const domains = await getDomains(colonyAddress);
  const parentDomain = domains.find((d) => d.id === parentDomainId);

  const incomingFunds = await getAllIncomingFunds(colonyAddress, parentDomain);

  const expenditures = await getAllExpenditures(colonyAddress, parentDomain);
  const filteredExpenditures = expenditures.filter(
    (expenditure) => !!expenditure.fundingActions?.items?.length,
  );
  const expendituresTokenAddresses =
    getTokenAddressesFromExpenditures(filteredExpenditures);
  const tokensDecimals = await getTokensDecimalsFor(expendituresTokenAddresses);

  // Getting all remaining financial actions not included in incoming funds or expenditures
  let actions = await getAllActions(colonyAddress, parentDomainId);

  console.log(filteredExpenditures.length);

  return [
    // ...getFormattedIncomingFunds(incomingFunds, parentDomainId),
    ...actions.map((action) => getActionWithFinalizedDate(action)),
    // ...getFormattedExpenditures(filteredExpenditures, parentDomainId, tokensDecimals),
  ];
};

const getTokensDatesMap = (actions) => {
  const tokens = {};

  actions.forEach((action) => {
    const tokenAddress = action.token?.id;

    if (!tokenAddress) {
      return;
    }

    if (!tokens[tokenAddress]) {
      tokens[tokenAddress] = [];
    }

    tokens[tokenAddress].push(action.finalizedDate);
  });
  return tokens;
};

const filterActionsWithinTimeframe = (
  actions,
  timeframe,
  timeframePeriodEndDate,
) =>
  actions.filter(
    (action) =>
      (!timeframe || isAfter(action.finalizedDate, timeframe)) &&
      isBefore(
        action.finalizedDate,
        timeframePeriodEndDate ? new Date(timeframePeriodEndDate) : Date.now(),
      ),
  );

const getDefaultDomainBalance = () => ({
  totalIn: 0,
  totalOut: 0,
  in: [],
  out: [],
});

const groupBalanceByPeriod = (
  timeframeType,
  timeframePeriod,
  timeframePeriodEndDate,
  actions,
  parentDomainId,
) => {
  const balance = {};

  // Initialise the balance for each period item within the timeframe
  for (let periodIndex = 0; periodIndex < timeframePeriod; periodIndex++) {
    const periodStartDate = getPeriodFor(periodIndex, timeframeType, timeframePeriodEndDate);
    const formattedPeriod = getPeriodFormat(periodStartDate, timeframeType);

    if (!balance[formattedPeriod]) {
      balance[formattedPeriod] = getDefaultDomainBalance();
    }
  }

  // Add each action to its corresponding balance period in/out operation
  actions.forEach((action) => {
    const period = getPeriodFormat(action.finalizedDate, timeframeType);
    if (action.fromDomainId === parentDomainId) {
      balance[period].out.push(action);
    } else if (action.toDomainId === parentDomainId) {
      balance[period].in.push(action);
    }
  });

  return balance;
};

module.exports = {
  getInOutActions,
  getTokensDatesMap,
  filterActionsWithinTimeframe,
  groupBalanceByPeriod,
};
