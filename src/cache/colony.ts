import { BigNumber } from 'ethers';

import { DEFAULT_NETWORK_TOKEN, ADDRESS_ZERO } from '~constants';
import { TokenType } from '~gql';

const colony = {
  Colony: {
    fields: {
      /*
       * @NOTE Add the local's chain native token to the colony's tokens list
       */
      tokens: {
        read: (baseTokens) => ({
          ...baseTokens,
          items: [
            ...baseTokens.items,
            {
              __typename: 'ColonyTokens',
              token: {
                __typename: 'Token',
                ...DEFAULT_NETWORK_TOKEN,
                id: ADDRESS_ZERO,
                avatar: null,
                thumbnail: null,
                tokenAdress: ADDRESS_ZERO,
                type: TokenType.Colony,
              },
            },
          ],
        }),
      },
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
    },
  },
};

export default colony;
