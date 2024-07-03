import { type ColonyAction, type ColonyMotion } from './graphql.ts';

export enum ManageVerifiedMembersOperation {
  Add = 'Add',
  Remove = 'Remove',
}

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
