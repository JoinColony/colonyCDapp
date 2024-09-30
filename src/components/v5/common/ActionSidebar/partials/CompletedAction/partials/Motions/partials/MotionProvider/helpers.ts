import { type MotionStakes } from '~types/graphql.ts';

export const compareMotionStakes = (
  oldMotionStakes: MotionStakes,
  newMotionStates: MotionStakes | undefined,
) =>
  oldMotionStakes.raw.yay !== newMotionStates?.raw.yay ||
  oldMotionStakes.raw.nay !== newMotionStates?.raw.nay;
