import { Domain } from '~types';

export interface TeamPointsRowProps {
  team: Domain;
}

export interface TeamPointsProps {
  id: string;
  color: string;
  name: string;
  points: number;
}

export interface TeamReputationSummaryProps {
  className?: string;
}
