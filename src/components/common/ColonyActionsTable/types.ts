import { Action } from '~constants/actions';
import {
  ActivityDecisionMethod,
  ActivityFeedColonyAction,
} from '~hooks/useActivityFeed/types';
import { MotionState } from '~utils/colonyMotions';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';

export interface ColonyActionsTableProps
  extends Partial<TableWithMeatballMenuProps<ActivityFeedColonyAction>> {
  pageSize?: number;
  withHeader?: boolean;
}

export type ColonyActionsTableFilters = {
  status: Record<MotionState, boolean>;
  decisionMethod: Record<ActivityDecisionMethod, boolean>;
  actionType: Record<Action, boolean>;
  date: {
    pastHour: boolean;
    pastDay: boolean;
    pastWeek: boolean;
    pastMonth: boolean;
    pastYear: boolean;
  };
};
