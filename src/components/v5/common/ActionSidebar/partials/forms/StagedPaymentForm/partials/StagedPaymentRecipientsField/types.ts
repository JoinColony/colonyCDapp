export interface StagedPaymentRecipientsFieldProps {
  name: string;
}

export interface StagedPaymentRecipientsTableModel {
  key: string;
}

export interface StagedPaymentRecipientsFieldModel {
  milestone?: string;
  amount?: string;
  tokenAddress?: string;
  slotId?: number;
  claimDelay?: string;
}
