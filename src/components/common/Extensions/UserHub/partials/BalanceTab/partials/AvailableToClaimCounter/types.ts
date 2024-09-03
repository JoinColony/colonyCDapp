export interface AvailableToClaimCounterProps {
  amountAvailableToClaim: number;
  getTotalFunds: () => Promise<void>;
  isAtLeastOnePaymentActive?: boolean;
  ratePerSecond: number;
}
