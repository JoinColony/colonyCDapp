import { type User } from '~types/graphql.ts';

export interface ReputationChartDataItem {
  color: string;
  id: string;
  label: string;
  searchParam?: string;
  shouldTruncateLegendLabel?: boolean;
  value: number;
}

export interface ContributorItem {
  user?: User | null;
  walletAddress: string;
  reputation?: number;
}
