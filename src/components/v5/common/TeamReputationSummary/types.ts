export interface TeamPointsRowProps {
  color: string;
  name: string;
  points: number;
}

export interface TeamPointsProps extends TeamPointsRowProps {
  id: string;
}

export interface TeamReputationSummaryProps {
  teams: TeamPointsProps[];
}
