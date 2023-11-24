import { Domain } from '~types';

export interface TeamPointsRowProps {
  team: Domain;
  suffix?: string;
}

export interface TeamPointsProps {
  id: string;
  color: string;
  name: string;
  points: number;
}

export interface TeamReputationSummaryProps {
  teams: TeamPointsProps[];
}
