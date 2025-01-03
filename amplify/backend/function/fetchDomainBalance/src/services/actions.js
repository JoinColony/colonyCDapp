const {
  getAllActions,
  getAllExpenditures,
  getDomains,
  getAllIncomingFunds,
  getTokensDecimalsFor,
} = require('../api/graphql/operations');
const {
  getFormattedActions,
  getFormattedIncomingFunds,
  getFormattedExpenditures,
  getTokenAddressesFromExpenditures,
  getFullPeriodFormat,
  getPeriodFor,
  isAfter,
  isBefore,
} = require('../utils');

const getInOutActions = async (colonyAddress, domainId) => {
  const domains = await getDomains(colonyAddress);

  // If the "All teams" filter is selected, then domain will be undefined
  const domain = domains.find((d) => d.id === domainId);

  const incomingFunds = await getAllIncomingFunds(colonyAddress, domain);

  // Fetches all expenditures within the domain, excluding expenditures that are part of a simple payment
  const expenditures = await getAllExpenditures(colonyAddress, domain);
  const filteredExpenditures = expenditures.filter(
    (expenditure) => !!expenditure.createExpenditureActions?.items?.length,
  );
  const expendituresTokenAddresses =
    getTokenAddressesFromExpenditures(filteredExpenditures);
  const tokensDecimals = await getTokensDecimalsFor(expendituresTokenAddresses);

  // Getting all remaining financial actions not included in incoming funds or expenditures
  let actions = await getAllActions(colonyAddress, domainId);

  return [
    ...getFormattedIncomingFunds(incomingFunds, domainId),
    ...getFormattedActions(actions, domainId),
    ...getFormattedExpenditures(filteredExpenditures, domainId, tokensDecimals),
  ].filter(
    (action) => !!action.token && (!!action.amount || !!action.networkFee),
  );
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
  domainId,
) => {
  const balance = {};

  // Initialise the balance for each period item within the timeframe
  for (let periodIndex = 0; periodIndex < timeframePeriod; periodIndex++) {
    const periodStartDate = getPeriodFor(
      periodIndex,
      timeframeType,
      timeframePeriodEndDate,
    );
    const formattedPeriod = getFullPeriodFormat(periodStartDate, timeframeType);

    if (!balance[formattedPeriod]) {
      balance[formattedPeriod] = getDefaultDomainBalance();
    }
  }
  // Add each action to its corresponding balance period in/out operation
  actions.forEach((action) => {
    const period = getFullPeriodFormat(action.finalizedDate, timeframeType);

    if (!balance[period]) {
      console.warn(`No balance entry configured for period ${period}`);
      return;
    }

    // If we are at colony level and the action has a type
    // The action is among the acceptedColonyActionTypes and must be an outgoing source of funds
    if (!domainId && action.type) {
      balance[period].out.push(action);
    }
    // Do not include outgoing transfers within the same domain
    else if (
      action.fromDomainId === domainId &&
      action.toDomainId !== domainId
    ) {
      balance[period].out.push(action);
      // Do not include incoming transfers within the same domain
    } else if (
      action.toDomainId === domainId &&
      action.fromDomainId !== domainId
    ) {
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
