import { ColonyAction, ColonyMotion } from './graphql';

export enum StakeSide {
  Motion = 'MOTION',
  Objection = 'OBJECTION',
}

/**
 * A "MotionAction" is a ColonyAction with MotionData defined (i.e. a motion).
 */

export interface MotionAction extends Omit<ColonyAction, 'motionData'> {
  motionData: ColonyMotion;
}
