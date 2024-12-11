import { type ExpenditureAction } from '~types/graphql.ts';

export interface FundingRequestsProps {
  actions: ExpenditureAction[];
}

export interface FundingRequestItemProps {
  action: ExpenditureAction;
  isOnlyItem: boolean;
}
