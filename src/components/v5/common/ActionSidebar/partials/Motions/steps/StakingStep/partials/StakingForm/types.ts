import { BigNumber } from 'ethers';
import { MotionVote } from '~utils/colonyMotions';

export interface StakingFormProps {
  userActivatedTokens: BigNumber;
  disableForm?: boolean;
}

export interface StakingFormValues {
  amount: string;
  voteType?: MotionVote;
}
