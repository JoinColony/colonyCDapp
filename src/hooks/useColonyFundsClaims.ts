import { ADDRESS_ZERO } from '~constants';
import { notNull } from '~utils/arrays';
import { ColonyClaims, ColonyChainClaimWithToken } from '~types';

import useColonyContext from './useColonyContext';

/*
 *
 */
const useColonyFundsClaims = (): ColonyClaims[] => {
  const { colony } = useColonyContext();
  const { fundsClaims, chainFundsClaim, tokens } = colony || {};
  const { items: claims = [] } = fundsClaims || {};

  /*
   * @NOTE We have to do some very heavy lifting (more or less) here due to us
   * not being able to use Apollo's cache, so we want to short-circuit early
   * in order to not waste any computing resources unecesarily
   */
  if (!chainFundsClaim && !claims) {
    return [];
  }

  const chainClaimWithToken: ColonyChainClaimWithToken | null = chainFundsClaim
    ? {
        ...chainFundsClaim,
        token: tokens?.items?.find(
          (token) => token?.token?.tokenAddress === ADDRESS_ZERO,
        )?.token,
      }
    : null;

  /*
   * Claims data needs to be merged, both ERC20's and Native Chain Tokens
   *
   * Also, we have to sort in-client since Apollo's cache is being a bitch
   * not allowing more than 3 local field entries without breaking, forcing us
   * to do the sorting / merging here, rather than at the time we fetch data.
   * This kinda sucks!
   */
  return [...claims, chainClaimWithToken]
    .filter(notNull)
    .sort(
      (first, second) =>
        (second?.createdAtBlock || 0) - (first?.createdAtBlock || 0),
    );
};

export default useColonyFundsClaims;
