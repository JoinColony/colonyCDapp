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
