export interface ExpenditureFormValues {
  payouts: ExpenditurePayoutFieldValue[];
}

export interface ExpenditurePayoutFieldValue {
  slotId?: number;
  recipientAddress: string;
  tokenAddress: string;
  amount: string;
  claimDelay: number;
}
