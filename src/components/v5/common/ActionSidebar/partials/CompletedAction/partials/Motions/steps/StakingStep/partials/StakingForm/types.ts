import { type BigNumber } from 'ethers';

import { type Action, type ActionTypes } from '~redux/index.ts';
import { type MotionVote } from '~utils/colonyMotions.ts';

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
