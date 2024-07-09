import {
  type ColonyAction,
  type ColonyMotion,
  type ColonyMultiSig,
} from './graphql.ts';

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

export type MultiSigAction = Omit<
  ColonyAction,
  'multiSigData' | 'multiSigId'
> & { multiSigData: ColonyMultiSig; multiSigId: string };
