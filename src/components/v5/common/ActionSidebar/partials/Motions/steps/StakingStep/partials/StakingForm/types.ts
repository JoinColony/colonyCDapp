import { BigNumber } from 'ethers';

import { Action, ActionTypes } from '~redux';
import { MotionVote } from '~utils/colonyMotions';

export interface StakingFormProps {
  userActivatedTokens: BigNumber;
  userInactivatedTokens: BigNumber;
  disableForm?: boolean;
}

export interface StakingFormValues {
  amount: string;
  voteType?: MotionVote;
}

export type StakeMotionPayload = Action<ActionTypes.MOTION_STAKE>['payload'];
