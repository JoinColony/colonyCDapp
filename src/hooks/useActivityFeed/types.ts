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
  actionTypes?: ColonyActionType[];
  motionStates?: MotionState[];
  dateFrom?: Date;
  dateTo?: Date;
  decisionMethod?: ActivityDecisionMethod;
}

export interface UseActivityFeedReturn {
  loading: boolean;
  actions: ColonyAction[];
  sortDirection: SearchableSortDirection;
  changeSortDirection: SortDirectionChangeHandler;
  hasNextPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  pageNumber: number;
}

export type SortDirectionChangeHandler = (
  newSortDirection: SearchableSortDirection,
) => void;
