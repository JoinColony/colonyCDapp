import { ActivityFeedColonyAction } from '~hooks/useActivityFeed/types';

export interface ActionDescriptionProps {
  action: ActivityFeedColonyAction;
  refetchMotionState: VoidFunction;
  loading: boolean;
}
