import { StreamingPaymentEndCondition } from '~gql';

export enum ExpenditureFormType {
  Advanced = 'Advanced',
  Staged = 'Staged',
  Streaming = 'Streaming',
}

export interface ExpenditurePayoutFieldValue {
  slotId?: number;
  recipientAddress: string;
  tokenAddress: string;
  amount: string;
  claimDelay: number;
}

export interface ExpenditureStageFieldValue {
  name: string;
  amount: string;
  tokenAddress: string;
}

interface BaseCreateExpenditureFormValues {
  createInDomainId: number;
  fundFromDomainId: number;
}

export interface AdvancedPaymentFormValues
  extends BaseCreateExpenditureFormValues {
  payouts: ExpenditurePayoutFieldValue[];
}

export interface StagedPaymentFormValues
  extends BaseCreateExpenditureFormValues {
  recipientAddress: string;
  stages: ExpenditureStageFieldValue[];
}

export interface StreamingPaymentFormValues
  extends BaseCreateExpenditureFormValues {
  recipientAddress: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  endCondition: StreamingPaymentEndCondition;
  tokenAddress: string;
  amount: string;
  interval: number;
  limitAmount?: string;
}

export type ExpenditureFormValues =
  | AdvancedPaymentFormValues
  | StagedPaymentFormValues
  | StreamingPaymentFormValues;
