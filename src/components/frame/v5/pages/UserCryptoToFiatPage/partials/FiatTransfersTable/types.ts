export interface Transfer {
  id: string;
  amount: string;
  state: string;
  created_at: string;
  deposit_tx_hash: string;
  receipt: {
    url: string;
    outgoing_amount: string;
    destination_currency: string;
  };
}

export interface FormattedTransfer {
  id: string;
  amount: string;
  amountNumeric: number;
  receiptUrl: string;
  state: string;
  createdAt: string;
}
