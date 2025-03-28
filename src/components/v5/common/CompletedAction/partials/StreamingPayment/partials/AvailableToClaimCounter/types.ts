import { type StreamingPaymentStatus } from '~types/streamingPayments.ts';

export interface AvailableToClaimCounterProps {
  hasEnoughFunds: boolean;
  status: StreamingPaymentStatus;
  amountAvailableToClaim: string;
  decimals: number;
  tokenSymbol: string;
  ratePerSecond: string;
  getAmounts: (currentTime: number) => void;
  currentTime: number;
}
