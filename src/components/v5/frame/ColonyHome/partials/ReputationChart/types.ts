import { type User } from '~types/graphql.ts';

export interface ReputationChartDataItem {
  label: string;
  value: number;
  id: string;
  color: string;
}

export interface ContributorItem {
  user?: User | null;
  walletAddress: string;
  reputation?: number;
}
