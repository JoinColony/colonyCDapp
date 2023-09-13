export enum ExpenditureFormType {
  Advanced = 'Advanced',
  Staged = 'Staged',
}

export interface ExpenditureFormValues {
  payouts: ExpenditurePayoutFieldValue[];
  createInDomainId: number;
  fundFromDomainId: number;
  formType: ExpenditureFormType;
  stages: ExpenditureStageFieldValue[];
  recipientAddress?: string;
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
