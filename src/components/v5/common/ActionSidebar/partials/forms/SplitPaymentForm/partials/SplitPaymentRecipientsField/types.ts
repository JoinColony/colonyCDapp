import { Token } from '~types/graphql';

import { DistributionMethod } from '../../../../consts';

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
