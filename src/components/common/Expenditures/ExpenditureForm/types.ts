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

export interface StreamingPaymentFormValues
  extends BaseCreateExpenditureFormValues {
  recipientAddress: string;
}

export type CreateExpenditureFormValues =
  | AdvancedPaymentFormValues
  | StreamingPaymentFormValues;
