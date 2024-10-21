import { type ExpenditureAction } from '~types/graphql.ts';

export interface CancelRequestsProps {
  actions: ExpenditureAction[];
}

export interface CancelRequestItemProps {
  action: ExpenditureAction;
}
