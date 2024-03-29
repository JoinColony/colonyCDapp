import { type Row } from '@tanstack/react-table';

import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import { type RefetchMotionStates } from '~hooks/useNetworkMotionStates.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

export interface ActionMobileDescriptionProps {
  actionRow: Row<ActivityFeedColonyAction>;
  refetchMotionStates: RefetchMotionStates;
  loadingMotionStates: boolean;
  loading: boolean;
  getMenuProps: (
    row: Row<ActivityFeedColonyAction>,
  ) => MeatBallMenuProps | undefined;
}
