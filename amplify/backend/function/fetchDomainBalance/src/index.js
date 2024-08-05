require('cross-fetch/polyfill');
const { isAfter, format } = require('date-fns')

const {
    providers,
    utils: { Logger },
    constants,
} = require('ethers');
const { getActionWithFinalizedDate, getMonthsFromNow, getDaysFromNow, getMonthFormat } = require('./utils');
const { getTotalConvertedAmountFor, getExchangeRatesFor } = require('./tokens');
const { getAllActions, getBalance, setEnvVariables, getDomains } = require('./queries');
Logger.setLogLevel(Logger.levels.ERROR);

const defaultDomainBalance = {
    totalIn: 0,
    totalOut: 0,
    in: [],
    out: []
}

// @TODO maybe rename the lambda function

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    try {
        await setEnvVariables();

        const { colonyAddress, domainAddress, chainId, selectedCurrency } = event.arguments?.input || {};
        const fourMonthsFromNow = getMonthsFromNow(4);
        const last30Days = getDaysFromNow(30);
        const monthlyBalance = {};
        const last30DaysBalance = { ...defaultDomainBalance }

        // we need some date for the balance ?! or should we consider today
        // also seems from the block ingestor that the expenditure balance updates also for transfer funds
        // or should we use getExpendituresByColony -> slots.payouts filter by isClaimed
        const colonyBalance = await getBalance(colonyAddress);
        const domainBalance = colonyBalance
            .filter(colonyBalanceItem => colonyBalanceItem.domain.id === domainAddress)
            .map(colonyBalanceItem => ({
                amount: colonyBalanceItem.balance,
                token: colonyBalanceItem.token,
                finalizedDate: (new Date()).toISOString()
            }));

        /**
         * @TODO also get child domains for which we should do operations recursively
         * however if financial actions have been executed between children of same domainAddress they shouldn't be taken into account
         */

        let actions = await getAllActions(colonyAddress, domainAddress);
        let tokens = {};

        actions
            .map((action) => getActionWithFinalizedDate(action))
            .filter(action => isAfter(action.finalizedDate, fourMonthsFromNow))
            .forEach(action => {
                const month = getMonthFormat(action.finalizedDate);
                if (!monthlyBalance[month]) {
                    monthlyBalance[month] = {...defaultDomainBalance};
                } 
                if (action.fromDomainId === domainAddress) {
                    monthlyBalance[month].out.push(action);
                } else if (action.toDomainId === domainAddress) {
                    monthlyBalance[month].in.push(action);
                }

                if (isAfter(action.finalizedDate, last30Days)) {
                    if (action.fromDomainId === domainAddress) {
                        last30DaysBalance.out.push(action);
                    } else if (action.toDomainId === domainAddress) {
                        last30DaysBalance.in.push(action);
                    }
                }

                const tokenAddress = action.token?.id;

                if (tokenAddress && !tokens[tokenAddress]) {
                    tokens[tokenAddress] = [];
                }
                tokens[tokenAddress].push(action.finalizedDate)
            })

        const exchangeRates = await getExchangeRatesFor({ tokens, currency: selectedCurrency, chainId });

        for (let month in monthlyBalance) {
            const tempMonthBalance = {...monthlyBalance[month]};
            const totalIn = await getTotalConvertedAmountFor(tempMonthBalance.in, exchangeRates);
            const totalOut = await getTotalConvertedAmountFor(tempMonthBalance.out, exchangeRates);
            monthlyBalance[month] = {
                ...monthlyBalance[month],
                totalIn,
                totalOut,
            }
        }

        const last30DaysBalanceTotalIn = await getTotalConvertedAmountFor(last30DaysBalance.in, exchangeRates);
        const last30DaysBalanceTotalOut = await getTotalConvertedAmountFor(last30DaysBalance.out, exchangeRates);

        return {
            last30Days: {
                ...last30DaysBalance,
                totalIn: last30DaysBalanceTotalIn,
                totalOut: last30DaysBalanceTotalOut
            },
            timeframe: Object.keys(monthlyBalance).map((month) => ({
                key: month,
                value: monthlyBalance[month]
            }))
        };
    } catch (e) {
        console.log('there was an error', e)
        console.error(e);
    }
};
