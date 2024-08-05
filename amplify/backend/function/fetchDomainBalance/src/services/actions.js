const { getAllActions, getAllExpenditures, getDomains, getAllIncomingFunds } = require('../api/graphql/requests');
const { 
    getActionWithFinalizedDate, 
    getFormattedIncomingFunds, 
    getFormattedExpenditures, 
    getPeriodFormat, 
    getPeriodFromNow,
    isAfter, 
    isBefore 
} = require('../utils');

const getInOutActions = async (colonyAddress, parentDomainAddress) => {

    /**
    * @TODO also get child domains for which we should do operations recursively
    * however if financial actions have been executed between children of same domainAddress they shouldn't be taken into account
    */
    /**
     * @TODO filter child domains for colonyAddress and parentDomainAddress
     */
    const domains = await getDomains(colonyAddress)
    const parentDomain = domains.find(d => d.id === parentDomainAddress);

    const incomingFunds = await getAllIncomingFunds(colonyAddress, parentDomain);

    const expenditures = await getAllExpenditures(parentDomain);

    // Getting all remaining financial actions not included in incoming funds or expenditures
    let actions = await getAllActions(colonyAddress, parentDomainAddress);

    return [
        ...getFormattedIncomingFunds(incomingFunds, parentDomainAddress),
        ...actions.map((action) => getActionWithFinalizedDate(action)),
        ...getFormattedExpenditures(expenditures, parentDomainAddress)
    ]
};

const getTokensDatesMap = (actions) => {
    const tokens = {};

    actions.forEach(action => {

        const tokenAddress = action.token?.id;

        if (tokenAddress && !tokens[tokenAddress]) {
            tokens[tokenAddress] = [];
        }
        tokens[tokenAddress].push(action.finalizedDate);
    })
    return tokens;
};

const filterActionsWithinTimeframe = (actions, timeframe) =>
    actions.filter(action => 
        isAfter(action.finalizedDate, timeframe) && 
        isBefore(action.finalizedDate, Date.now())
    );


const getDefaultDomainBalance = () => ({
    totalIn: 0,
    totalOut: 0,
    in: [],
    out: []
})


const updatePeriodBalance = (timeframeType, timeframePeriod, actions, parentDomainAddress) => {
    const balance = {};

    // Initialise the balance for each period item within the timeframe
    for (let periodIndex = 0; periodIndex < timeframePeriod; periodIndex++) {
        const periodStartDate = getPeriodFromNow(periodIndex, timeframeType);
        const formattedPeriod = getPeriodFormat(periodStartDate, timeframeType);

        if (!balance[formattedPeriod]) {
            balance[formattedPeriod] = getDefaultDomainBalance();
        }
    }

    // Add each action to its corresponding balance period in/out operation
    actions.forEach(action => {
        const period = getPeriodFormat(action.finalizedDate, timeframeType);
        if (action.fromDomainId === parentDomainAddress) {
            balance[period].out.push(action);
        } else if (action.toDomainId === parentDomainAddress) {
            balance[period].in.push(action);
        }
    });

    return balance;
};

const update30DaysBalance = (actions, parentDomainAddress) => {
    const last30DaysBalance = getDefaultDomainBalance();

    actions.forEach(action => {
        if (action.fromDomainId === parentDomainAddress) {
            last30DaysBalance.out.push(action);
        } else if (action.toDomainId === parentDomainAddress) {
            last30DaysBalance.in.push(action);
        }
    });

    return last30DaysBalance;
};

module.exports = {
    getInOutActions,
    getTokensDatesMap,
    filterActionsWithinTimeframe,
    updatePeriodBalance,
    update30DaysBalance,
}