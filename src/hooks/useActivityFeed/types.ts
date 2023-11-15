import {
  ColonyAction,
  ColonyActionType,
  SearchableSortDirection,
} from '~types';
import { MotionState } from '~utils/colonyMotions';

export interface ActivityFeedFilters {
  actionTypes?: ColonyActionType[];
  motionStates?: MotionState[];
  dateFrom?: Date;
  dateTo?: Date;
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
