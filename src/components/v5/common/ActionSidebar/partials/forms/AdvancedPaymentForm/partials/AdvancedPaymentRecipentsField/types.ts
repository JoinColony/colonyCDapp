export interface AdvancedPaymentRecipentsTableModel {
  key: string;
}

export interface AdvancedPaymentRecipentsFieldProps {
  name: string;
}

export interface AdvancedPaymentRecipentsFieldModel {
  recipient?: string;
  amount?: {
    amount?: number;
    tokenAddress?: string;
  };
  delay?: number;
}
