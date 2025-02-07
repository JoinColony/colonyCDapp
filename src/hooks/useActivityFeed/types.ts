import { type SearchActionsQueryVariables } from '~gql';
import { type RefetchMotionStates } from '~hooks/useNetworkMotionStates.ts';
import { type AnyActionType } from '~types/actions.ts';
import {
  type ColonyAction,
  type SearchableSortDirection,
} from '~types/graphql.ts';
import { type MotionState } from '~utils/colonyMotions.ts';

export enum ActivityDecisionMethod {
  Permissions = 'Permissions',
  Reputation = 'Reputation',
  MultiSig = 'MultiSig',
}

export interface ActivityFeedFilters {
  teamId?: string;
  actionTypes?: AnyActionType[];
  motionStates?: MotionState[];
  dateFrom?: Date;
  dateTo?: Date;
  decisionMethods?: ActivityDecisionMethod[];
  search?: string;
  chainIds?: string[];
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
