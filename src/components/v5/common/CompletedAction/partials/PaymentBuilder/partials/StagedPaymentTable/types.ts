import { type Expenditure } from '~types/graphql.ts';

export interface StagedPaymentTableProps {
  expenditure: Expenditure;
  isLoading?: boolean;
  isPaymentStep?: boolean;
  finalizedAt: number;
}
