import { type ActionData } from '~actions/index.ts';

import { type ColonyMotion, type ColonyMultiSig } from './graphql.ts';

export enum StakeSide {
  Motion = 'MOTION',
  Objection = 'OBJECTION',
}

/**
 * A "MotionAction" is a ColonyAction with MotionData defined (i.e. a motion).
 */

export interface MotionAction extends Omit<ActionData, 'motionData'> {
  motionData: ColonyMotion;
}

export type MultiSigAction = Omit<ActionData, 'multiSigData' | 'multiSigId'> & {
  multiSigData: ColonyMultiSig;
  multiSigId: string;
};
