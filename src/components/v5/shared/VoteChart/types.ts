export interface VoteChartProps {
  percentageVotesFor: number;
  percentageVotesAgainst: number;
  threshold: number;
  againstLabel: string;
  forLabel: string;
  thresholdLabel?: string;
}
