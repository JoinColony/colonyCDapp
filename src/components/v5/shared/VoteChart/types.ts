export interface VoteChartProps {
  percentageVotesFor: number;
  percentageVotesAgainst: number;
  againstLabel: string;
  forLabel: string;
  thresholdLabel?: string;
  threshold?: number;
  className?: string;
}
