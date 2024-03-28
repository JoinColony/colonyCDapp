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
