import { Token } from '~types/graphql.ts';

import { DistributionMethod } from '../../../../consts.tsx';

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
