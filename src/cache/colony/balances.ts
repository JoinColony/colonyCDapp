import { BigNumber } from 'ethers';
import {
  DEFAULT_NETWORK_TOKEN,
  ADDRESS_ZERO,
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
} from '~constants';

const BALANCE_TYPE_NAME = 'ColonyBalance';

/*
 * If token has Address Zero as it's address return local data representing
 * the local chain token, otherwise just return the token
 */
const getTokenDataWithNative = (token) => {
  if (token.id !== ADDRESS_ZERO) {
    return token;
  }
  return {
    ...token, // needed to add the correct data types
    ...DEFAULT_NETWORK_TOKEN,
  };
};

/*
 * We're recreating the balances array in order to change the native chain
 * token data to include the correct one from the one currently deployed
 *
 * @NOTE This is actually a wrong way to go about it, and once Multisig
 * is upon us, we should be using the chain the colony is deployed to
 * in order to dynamically contruct this (since multiple colonies
 * can be deployed to multiple chains)
 *
 * @WARNING we have to get the full domain, and basically recreate the
 * whole balance object (including the typename) since, if the alternative
 * is true, and we pass the reference along, it will actually prevent
 * us from returning the modified data, and will overwrite our returned
 * results with the ones already available in the cache.
 */
const getAllDomainBalancesFromRefs = (
  domainBalanceRefs: { _ref: string }[],
  { readField, cache },
) =>
  domainBalanceRefs.map((balanceRef) => {
    const token = readField('token', balanceRef);
    const balance = readField('balance', balanceRef);
    const id = readField('id', balanceRef);
    const domainRef = readField('domain', balanceRef);
    const domainId = readField('id', domainRef);
    /*
     * We're accessing a Apollo internal API to avoid having to call `readField`
     * for all fields on the domain object.
     *
     * @NOTE I choose to go this route as I'm fairly sure we're going to change
     * the model for domains soon enought, which would have made places like these
     * needed to be updated after that, which just screams the we're going
     * to forget about it. This way all model changes are basically transparent
     * to this code
     */
    const domain = cache.data.data[`Domain:${domainId}`];
    return {
      __typename: BALANCE_TYPE_NAME,
      id,
      domain,
      token: getTokenDataWithNative(token),
      balance,
    };
  });

const getTotalTokenBalances = (allDomainBalances) =>
  allDomainBalances.reduce((totals, balance) => {
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

const balancesFieldCache = {
  /*
   * @NOTE Calculate total token balances across all domains (domain 0)
   *
   * This is based on all the token balances available in all the other domains,
   * including root
   */
  balances: {
    read: (domainBalanceRefs, { readField, cache }) => {
      const colonyAddress = readField('id');
      const { chainId: colonyChainId } = readField('meta');
      const { items: colonyTokens = [] } = readField('tokens');

      const allDomainBalances = getAllDomainBalancesFromRefs(
        domainBalanceRefs.items,
        { readField, cache },
      );
      const totalTokenBalances = getTotalTokenBalances(allDomainBalances);
      return {
        ...domainBalanceRefs,
        items: [
          ...allDomainBalances,
          ...colonyTokens.map(({ token }) => ({
            __typename: BALANCE_TYPE_NAME,
            domain: null,
            id: `${colonyChainId}_${colonyAddress}_${COLONY_TOTAL_BALANCE_DOMAIN_ID}_${token.id}_balance`,
            token,
            balance: totalTokenBalances[token.id].toString(),
          })),
        ],
      };
    },
  },
};

export default balancesFieldCache;
