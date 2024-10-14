import { type ExpenditureStage } from '~gql';
import { type ExpenditureSlot } from '~types/graphql.ts';

export interface StagedPaymentTableProps {
  stages: ExpenditureStage[];
  slots: ExpenditureSlot[];
  isLoading?: boolean;
  isPaymentStep?: boolean;
  finalizedAt: number;
}
