import Decimal from 'decimal.js';
import { MotionData } from '~gql';
import { Address } from '~types';

export const getStakeFromSlider = (
  sliderAmount: number,
  remainingToStake: Decimal,
  minUserStake: Decimal,
) =>
  new Decimal(sliderAmount)
    .div(100)
    .times(remainingToStake.sub(minUserStake))
    .plus(minUserStake);

export const getFinalStake = (
  sliderAmount: number,
  remainingToStake: Decimal,
  minUserStake: Decimal,
) => {
  if (sliderAmount === 100) {
    return remainingToStake.toString();
  }

  const stake = getStakeFromSlider(
    sliderAmount,
    remainingToStake,
    minUserStake,
  );

  return stake.round().toString();
};

export const convertStakeToPercentage = (
  stake: string | Decimal,
  requiredStake: Decimal,
) => {
  const divisibleRequiredStake = requiredStake.isZero() ? 1 : requiredStake;
  return new Decimal(stake).div(divisibleRequiredStake).mul(100).toDP(2);
};

export const formatStakePercentage = (stakePercentage: number) => {
  const formatted = stakePercentage.toFixed(2);

  if (formatted === '1.00') {
    return '1';
  }
  if (formatted === '100.00') {
    return '100';
  }

  return formatted;
};

export const getRemainingToStake = (
  isObjection: boolean,
  requiredStake: Decimal,
  { yay, nay }: { yay: string; nay: string },
) => {
  const remainingToFullyYayStaked = requiredStake.sub(yay);
  const remainingToFullyNayStaked = requiredStake.sub(nay);

  const remainingToStake = isObjection
    ? remainingToFullyNayStaked
    : remainingToFullyYayStaked;

  return { remainingToStake, remainingToFullyNayStaked };
};

export const getStakedPercentages = (
  isObjection: boolean,
  requiredStake: Decimal,
  {
    yay,
    nay,
  }: {
    yay: string;
    nay: string;
  },
) => {
  const yayPercentage = convertStakeToPercentage(yay, requiredStake).toNumber();
  const nayPercentage = convertStakeToPercentage(nay, requiredStake).toNumber();
  const totalPercentage = isObjection ? nayPercentage : yayPercentage;

  return { yayPercentage, nayPercentage, totalPercentage };
};

const getUserStakeLimit = (
  remainingToStake: Decimal,
  minUserStake: Decimal,
  maxUserStake: Decimal,
  userActivatedTokens: Decimal,
) =>
  remainingToStake.lte(minUserStake)
    ? new Decimal(0)
    : (maxUserStake.gte(userActivatedTokens)
        ? userActivatedTokens
        : maxUserStake
      ).minus(minUserStake);

const convertUserStakeToPercentage = (
  userStakeLimit: Decimal,
  remainingToStake: Decimal,
  minUserStake: Decimal,
) => userStakeLimit.div(remainingToStake.minus(minUserStake)).toDP(2);

export const getUserStakeLimitPercentage = (
  remainingToStake: Decimal,
  minUserStake: Decimal,
  maxUserStake: Decimal,
  userActivatedTokens: Decimal,
) => {
  const userStakeLimit = getUserStakeLimit(
    remainingToStake,
    minUserStake,
    maxUserStake,
    userActivatedTokens,
  );
  return convertUserStakeToPercentage(
    userStakeLimit,
    remainingToStake,
    minUserStake,
  );
};

export const getUserStakes = (
  usersStakes: MotionData['usersStakes'],
  userAddress: Address,
) => {
  const userStake = usersStakes.find(({ address }) => address === userAddress);
  return userStake?.stakes.raw ?? null;
};
