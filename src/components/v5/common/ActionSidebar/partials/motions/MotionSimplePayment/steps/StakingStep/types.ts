import { GetColonyActionQuery } from '~gql';
import { MotionVote } from '~utils/colonyMotions';

export interface StakingStepProps {
  className?: string;
  action: GetColonyActionQuery['getColonyAction'];
  transactionId: string;
}

export interface StakingFormValues {
  amount: string;
  voteType?: MotionVote;
}
