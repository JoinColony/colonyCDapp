import { ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import { RefetchMotionStates } from '~hooks/useNetworkMotionStates.ts';

export interface ActionDescriptionProps {
  action: ActivityFeedColonyAction;
  refetchMotionStates: RefetchMotionStates;
  loading: boolean;
}
