import { BigNumber } from 'ethers';

/**
 * Utility to determine if user's reputation in the domain is less than the amount still needed to stake, i.e. their
 * staking ability is limited, not by their number of tokens activated, but by their (lack of) reputation.
 */
export const userHasInsufficientReputation = (
  userActivatedTokens: BigNumber,
  userMaxStake: BigNumber,
  remainingToStake: string,
) => userActivatedTokens.gt(userMaxStake) && userMaxStake.lt(remainingToStake);

/**
 *
 * Utility to determine whether the remaining amount to be staked is less than the user's minimum stake. (i.e. can't
 * stake more than 100% of a motion)
 */

export const userCanStakeMore = (
  userMinStake: string,
  remainingToStake: string,
) => BigNumber.from(remainingToStake).gte(userMinStake);
