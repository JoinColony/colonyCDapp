import { BigNumber } from 'ethers';

import { Action, ActionTypes } from '~redux/index.ts';
import { MotionVote } from '~utils/colonyMotions.ts';

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
