export interface PaymentCounterProps {
  finalizedTimestamp: number;
  claimDelay: string;
  showSingleValue?: boolean;
  onTimeEnd?: () => void;
}
