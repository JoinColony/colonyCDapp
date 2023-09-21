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

export enum StreamingPaymentEndCondition {
  WhenCancelled = 'WhenCancelled',
  LimitReached = 'LimitReached',
  FixedTime = 'FixedTime',
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
  startTime: number;
  endTime?: number;
  endCondition: StreamingPaymentEndCondition;
  tokenAddress: string;
  amount: string;
  interval: number;
}

export type ExpenditureFormValues =
  | AdvancedPaymentFormValues
  | StagedPaymentFormValues
  | StreamingPaymentFormValues;
