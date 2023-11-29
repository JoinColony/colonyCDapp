import { ActivityFeedColonyAction } from '~hooks/useActivityFeed/types';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';

export interface ColonyActionsTableProps
  extends Partial<TableWithMeatballMenuProps<ActivityFeedColonyAction>> {
  pageSize?: number;
  withHeader?: boolean;
}
