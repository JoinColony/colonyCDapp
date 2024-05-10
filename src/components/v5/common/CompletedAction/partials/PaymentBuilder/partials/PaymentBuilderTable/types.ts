import { type ExpenditureStatus } from '~gql';
import { type ExpenditureSlot } from '~types/graphql.ts';

import { type AmountFieldProps } from './partials/AmountField/types.ts';

export interface PaymentBuilderTableProps {
  items: ExpenditureSlot[];
  status: ExpenditureStatus;
  finalizedTimestamp?: number | null;
  isLoading?: boolean;
}

export interface PaymentBuilderTableModel extends AmountFieldProps {
  recipient: string;
  claimDelay: string;
  isClaimed: boolean;
  id: number;
}
