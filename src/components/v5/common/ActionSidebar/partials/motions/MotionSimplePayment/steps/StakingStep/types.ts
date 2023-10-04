import { GetColonyActionQuery } from '~gql';

export interface StakingStepProps {
  className?: string;
  action: GetColonyActionQuery['getColonyAction'];
  transactionId: string;
}
