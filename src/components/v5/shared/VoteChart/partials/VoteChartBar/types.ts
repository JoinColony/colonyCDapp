export enum VoteChartBarDirection {
  Left = 'left',
  Right = 'right',
}

export interface VoteChartBarProps {
  value: number;
  predictedValue?: number;
  barBackgroundClassName: string;
  predictionBarClassName: string;
  direction: VoteChartBarDirection;
}
