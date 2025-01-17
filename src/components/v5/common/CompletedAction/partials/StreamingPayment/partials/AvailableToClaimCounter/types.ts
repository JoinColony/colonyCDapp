import { type StreamingPaymentStatus } from '~types/streamingPayments.ts';

export interface AvailableToClaimCounterProps {
  hasEnoughFunds: boolean;
  status: StreamingPaymentStatus;
  onTimeEnd: () => void;
  amountAvailableToClaim: string;
  decimals: number;
  tokenSymbol: string;
  getAmounts: () => void;
  ratePerSecond: string;
}
