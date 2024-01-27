import { Domain } from '~types/graphql.ts';

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
