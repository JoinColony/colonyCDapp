import { DomainColor } from '~gql';

export interface TeamPointsRowProps {
  color?: DomainColor;
  name?: string;
  id: number;
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
