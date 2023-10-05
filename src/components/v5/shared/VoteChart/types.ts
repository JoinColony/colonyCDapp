export interface VoteChartProps {
  percentageVotesFor: number;
  percentageVotesAgainst: number;
  againstLabel: string;
  forLabel: string;
  threshold?: number;
  thresholdLabel?: string;
  className?: string;
}
