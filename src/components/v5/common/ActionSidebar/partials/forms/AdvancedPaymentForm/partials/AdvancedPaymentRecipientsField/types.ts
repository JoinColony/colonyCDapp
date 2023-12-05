export interface AdvancedPaymentRecipientsTableModel {
  key: string;
}

export interface AdvancedPaymentRecipientsFieldProps {
  name: string;
}

export interface AdvancedPaymentRecipientsFieldModel {
  recipient?: string;
  amount?: {
    amount?: number;
    tokenAddress?: string;
  };
  delay?: number;
}
