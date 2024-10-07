export interface StreamingTableFieldModel {
  user: string;
  userStreams: {
    amount: string;
    tokenAddress: string;
    tokenDecimals: number;
  };
  actions: StreamingActionTableFieldModel[];
}

export interface StreamingActionTableFieldModel {
  title: string;
  streamed: string;
  token: {
    symbol: string;
    address: string;
    decimals: number;
  };
  team: number;
  paymentId: string;
  recipient: string;
  initiator: string;
  period: string;
  transactionId: string;
}
