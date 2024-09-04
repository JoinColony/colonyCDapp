import { type ExpenditureAction } from '~types/graphql.ts';

export interface ReleaseRequestsProps {
  actions: ExpenditureAction[];
}

export interface ReleaseRequestItemProps {
  action: ExpenditureAction;
}
