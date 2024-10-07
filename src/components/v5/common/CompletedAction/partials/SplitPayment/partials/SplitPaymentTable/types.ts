import { type ExpenditureStatus } from '~gql';
import { type ExpenditureSlot } from '~types/graphql.ts';
import { type AmountFieldProps } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/PaymentBuilderTable/partials/AmountField/types.ts';

export interface SplitPaymentTableProps {
  items: ExpenditureSlot[];
  status: ExpenditureStatus;
  isLoading?: boolean;
}

export interface SplitPaymentTableModel extends AmountFieldProps {
  recipient: string;
  percent: number;
  id: number;
}
