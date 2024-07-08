export interface ClaimStatusBadgeProps {
  claimDelay: string;
  finalizedTimestamp?: number | null;
  isClaimed?: boolean;
  isClaimable?: boolean;
  onTimeEnd?: () => void;
}
