import { type Token } from '~types/graphql.ts';
import { type DistributionMethod } from '~v5/common/ActionSidebar/partials/consts.tsx';

export interface SplitPaymentRecipientsFieldProps {
  name: string;
  distributionMethod?: DistributionMethod;
  token: Token;
  amount: number;
}

export interface SplitPaymentRecipientsTableModel {
  key: string;
}

export interface SplitPaymentRecipientsFieldModel {
  recipient?: string;
  percent?: number;
}
