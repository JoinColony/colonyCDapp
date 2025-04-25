import { type ExpenditureStatus } from '~gql';
import { type ExpenditureSlot } from '~types/graphql.ts';

import { type AmountFieldProps } from './partials/AmountField/types.ts';

export interface PaymentBuilderTableProps {
  items: ExpenditureSlot[];
  status: ExpenditureStatus;
  finalizedTimestamp?: number | null;
  expectedNumberOfPayouts?: number | null;
}

export interface PaymentBuilderTableModel extends AmountFieldProps {
  recipient: string;
  claimDelay: string;
  isClaimed: boolean;
  id: number;
  oldValues?: ExpenditureSlot;
  newValues?: ExpenditureSlot;
}
