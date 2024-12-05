import { STAKING_THRESHOLD } from '~constants';
import { type MotionStakes } from '~types/graphql.ts';

export const compareMotionStakes = (
  oldMotionStakes: MotionStakes,
  newMotionStates: MotionStakes | undefined,
) =>
  oldMotionStakes.raw.yay !== newMotionStates?.raw.yay ||
  oldMotionStakes.raw.nay !== newMotionStates?.raw.nay;

export const hasMotionJustPassedThreshold = (
  oldMotionStakes: MotionStakes,
  newMotionStates: MotionStakes | undefined,
) => {
  const { nay: oldNay, yay: oldYay } = oldMotionStakes.percentage;
  const { nay: newNay, yay: newYay } = newMotionStates?.percentage || {};

  if (
    Number(oldNay) >= STAKING_THRESHOLD ||
    Number(oldYay) >= STAKING_THRESHOLD
  ) {
    return false;
  }

  if (
    Number(newNay) < STAKING_THRESHOLD &&
    Number(newYay) < STAKING_THRESHOLD
  ) {
    return false;
  }

  return true;
};
