import { type FieldValues } from 'react-hook-form';

import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import { type PaginatedTableProps } from '~v5/common/Table/refactoring/types.ts';

export interface ColonyActionsTableProps
  extends Partial<PaginatedTableProps<ActivityFeedColonyAction>> {
  pageSize?: number;
  withHeader?: boolean;
  showUserAvatar?: boolean;
  isRecentActivityVariant?: boolean;
  actionProps: {
    selectedAction?: string;
    setSelectedAction: (actionHash: string | undefined) => void;
    defaultValues?: FieldValues;
  };
}
