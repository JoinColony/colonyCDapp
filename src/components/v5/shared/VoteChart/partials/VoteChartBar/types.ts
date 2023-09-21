export const VOTE_CHART_BAR_DIRECTION = {
  Left: 'left',
  Right: 'right',
} as const;

export type VoteChartBarDirection =
  (typeof VOTE_CHART_BAR_DIRECTION)[keyof typeof VOTE_CHART_BAR_DIRECTION];

export interface VoteChartBarProps {
  value: number;
  barBackgroundClassName: string;
  direction: VoteChartBarDirection;
}
