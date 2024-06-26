import { type SplitPaymentDistributionType } from '~gql';
import { type Token } from '~types/graphql.ts';

export interface SplitPaymentRecipientsFieldProps {
  name: string;
  distributionMethod?: SplitPaymentDistributionType;
  token: Token;
  disabled?: boolean;
}

export interface SplitPaymentRecipientsTableModel {
  key: string;
}

export interface SplitPaymentRecipientsFieldModel {
  recipient?: string;
  percent?: number;
  amount?: string;
  tokenAddress?: string;
}
