import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import { type RefetchMotionStates } from '~hooks/useNetworkMotionStates.ts';

export interface ActionDescriptionProps {
  action: ActivityFeedColonyAction;
  refetchMotionStates: RefetchMotionStates;
  loading: boolean;
  hideDetails?: boolean;
  showUserAvatar?: boolean;
}
