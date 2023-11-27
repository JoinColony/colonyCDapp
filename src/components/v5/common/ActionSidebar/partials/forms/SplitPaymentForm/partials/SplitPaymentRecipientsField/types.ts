import { DistributionMethod } from '../../../../consts';
import { Token } from '~types';

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
