import { type ExpenditureSlotFragment } from '~gql';

export interface PaymentBuilderTableProps {
  items: ExpenditureSlotFragment[];
}

export interface AmountProps {
  amount: string;
  token: string;
}

export interface PaymentBuilderTableModel {
  key: React.Key;
  recipient: string;
  amount: AmountProps[];
  claimDelay: string;
}

export interface RecipientFieldProps {
  address: string;
}
