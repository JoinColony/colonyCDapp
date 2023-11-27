export interface VoteChartProps {
  percentageVotesFor: number;
  predictPercentageVotesFor?: number;
  percentageVotesAgainst: number;
  predictPercentageVotesAgainst?: number;
  againstLabel: string;
  forLabel: string;
  threshold?: number;
  thresholdLabel?: string;
  className?: string;
}
