export enum VOTE_CHART_BAR_DIRECTION {
  Left = 'left',
  Right = 'right',
}

export type VoteChartBarDirection =
  (typeof VOTE_CHART_BAR_DIRECTION)[keyof typeof VOTE_CHART_BAR_DIRECTION];

export interface VoteChartBarProps {
  value: number;
  predictedValue?: number;
  barBackgroundClassName: string;
  predictionBarClassName: string;
  direction: VoteChartBarDirection;
}
