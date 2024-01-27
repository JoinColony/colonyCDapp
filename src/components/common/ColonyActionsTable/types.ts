import { ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types.ts';

export interface ColonyActionsTableProps
  extends Partial<TableWithMeatballMenuProps<ActivityFeedColonyAction>> {
  pageSize?: number;
  withHeader?: boolean;
}
