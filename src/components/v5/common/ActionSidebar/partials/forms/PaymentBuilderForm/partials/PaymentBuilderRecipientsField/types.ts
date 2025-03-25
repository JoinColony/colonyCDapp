export interface PaymentBuilderRecipientsTableModel {
  key: string;
}

export interface PaymentBuilderRecipientsFieldProps {
  name: string;
}

export interface PaymentBuilderRecipientsFieldModel {
  recipient?: string;
  amount?: string;
  tokenAddress?: string;
  delay?: string;
  slotId?: number;
}
