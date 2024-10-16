import { type ActionData, type CoreAction } from '~actions';
import { type DecisionMethod, type SearchActionsQueryVariables } from '~gql';
import { type RefetchMotionStates } from '~hooks/useNetworkMotionStates.ts';
import { type SearchableSortDirection } from '~types/graphql.ts';
import { type MotionState } from '~utils/colonyMotions.ts';

export interface ActivityFeedFilters {
  teamId?: string;
  actionTypes?: CoreAction[];
  motionStates?: MotionState[];
  dateFrom?: Date;
  dateTo?: Date;
  decisionMethods?: DecisionMethod[];
  search?: string;
}

export type ActivityFeedSort = SearchActionsQueryVariables['sort'];

export type SearchActionsFilterVariable = SearchActionsQueryVariables['filter'];

export interface ActivityFeedOptions {
  pageSize?: number;
}

export interface ActivityFeedColonyAction extends ActionData {
  motionState?: MotionState;
}

export interface UseActivityFeedReturn {
  actions: ActivityFeedColonyAction[];
  loadingFirstPage: boolean;
  loadingNextPage: boolean;
  loadingMotionStates: boolean;
  hasNextPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  pageNumber: number;
  hasPrevPage: boolean;
  refetchMotionStates: RefetchMotionStates;
}

export type SortDirectionChangeHandler = (
  newSortDirection: SearchableSortDirection,
) => void;
