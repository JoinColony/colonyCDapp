export interface PaymentCounterProps {
  finalizedTimestamp: number;
  claimDelay: number;
  showSingleValue?: boolean;
  onTimeEnd?: () => void;
}
