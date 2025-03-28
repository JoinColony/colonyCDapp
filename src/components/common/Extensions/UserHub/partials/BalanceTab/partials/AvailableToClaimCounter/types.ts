export interface AvailableToClaimCounterProps {
  amountAvailableToClaim: number;
  getTotalFunds: (currentTimestamp: number) => Promise<void>;
  isAtLeastOnePaymentActive?: boolean;
  ratePerSecond: number;
  currentTimestamp: number;
}
