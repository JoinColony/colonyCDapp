import { SearchActionsQueryVariables } from '~gql';
import { RefetchMotionStates } from '~hooks/useNetworkMotionStates';
import {
  ColonyAction,
  ColonyActionType,
  SearchableSortDirection,
} from '~types';
import { MotionState } from '~utils/colonyMotions';

export enum ActivityDecisionMethod {
  Permissions = 'Permissions',
  Reputation = 'Reputation',
}

export interface ActivityFeedFilters {
  teamId?: string;
  actionTypes?: ColonyActionType[];
  motionStates?: MotionState[];
  dateFrom?: Date;
  dateTo?: Date;
  decisionMethod?: ActivityDecisionMethod;
}

export type ActivityFeedSort = SearchActionsQueryVariables['sort'];

export type SearchActionsFilterVariable = SearchActionsQueryVariables['filter'];

export interface ActivityFeedOptions {
  pageSize?: number;
}

export interface ActivityFeedColonyAction extends ColonyAction {
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
