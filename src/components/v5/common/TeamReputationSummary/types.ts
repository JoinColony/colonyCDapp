export interface TeamPointsProps {
  id: string;
  color: string;
  name: string;
  points: number;
}

export interface TeamReputationSummaryProps {
  teams: TeamPointsProps[];
}
