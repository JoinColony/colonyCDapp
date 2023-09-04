export enum ExpenditureFormType {
  Advanced = 'Advanced',
  Staged = 'Staged',
}

export interface ExpenditureFormValues {
  payouts: ExpenditurePayoutFieldValue[];
  createInDomainId: number;
  fundFromDomainId: number;
  type: ExpenditureFormType;
}

export interface ExpenditurePayoutFieldValue {
  slotId?: number;
  recipientAddress: string;
  tokenAddress: string;
  amount: string;
  claimDelay: number;
}
