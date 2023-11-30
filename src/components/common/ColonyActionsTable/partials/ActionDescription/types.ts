import { ActivityFeedColonyAction } from '~hooks/useActivityFeed/types';
import { RefetchMotionStates } from '~hooks/useNetworkMotionStates';

export interface ActionDescriptionProps {
  action: ActivityFeedColonyAction;
  refetchMotionStates: RefetchMotionStates;
  loading: boolean;
}
