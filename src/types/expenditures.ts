import { type ExpenditurePayout } from './graphql.ts';

export interface ExpenditurePayoutFieldValue {
  slotId?: number;
  recipientAddress: string;
  tokenAddress: string;
  amount: string;
  claimDelay: string;
  tokenDecimals?: number;
}

export interface ExpenditureStageFieldValue {
  name: string;
  amount: string;
  tokenAddress: string;
}

export interface ExpenditurePayoutWithSlotId extends ExpenditurePayout {
  slotId: number;
}

export enum ExpenditureActionStatus {
  Review = 'Review',
  Funding = 'Funding',
  Release = 'Release',
  Changes = 'Changes',
  Cancel = 'Cancel',
  Canceled = 'Canceled',
  Payable = 'Payable',
  Passed = 'Passed',
  Edit = 'Edit',
}
