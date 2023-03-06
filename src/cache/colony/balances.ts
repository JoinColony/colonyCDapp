import { BigNumber } from 'ethers';

const balancesFieldCache = {
  /*
   * @NOTE Calculate total token balances across all domains (domain 0)
   *
   * This is based on all the token balances available in all the other domains,
   * including root
   */
  balances: {
    read: (domainBalanceRefs, { readField }) => {
      const colonyAddress = readField('id');
      const { chainId: colonyChainId } = readField('meta');
      const { items: colonyTokens = [] } = readField('tokens');
      const totalTokenBalances = domainBalanceRefs.items
        .map((balanceRef) => {
          const token = readField('token', balanceRef);
          const balance = readField('balance', balanceRef);
          return { token, balance };
        })
        .reduce((totals, balance) => {
          const {
            token: { id: currentToken },
            balance: currentBalance,
          } = balance;
          if (totals[currentToken]) {
            return {
              ...totals,
              [currentToken]: totals[currentToken].add(currentBalance),
            };
          }
          return {
            ...totals,
            [currentToken]: BigNumber.from(currentBalance),
          };
        }, {});
      return {
        ...domainBalanceRefs,
        items: [
          ...domainBalanceRefs.items,
          ...colonyTokens.map(({ token }) => ({
            __typename: 'ColonyBalance',
            domain: null,
            id: `${colonyChainId}_${colonyAddress}_0_${token.id}_balance`,
            token,
            balance: totalTokenBalances[token.id].toString(),
          })),
        ],
      };
    },
  },
};

export default balancesFieldCache;
