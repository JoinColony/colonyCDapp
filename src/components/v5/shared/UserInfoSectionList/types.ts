import { MotionBadgeProps } from '~v5/common/ActionSidebar/partials/Motions/partials/MotionBadge/types';

import { UserInfoListProps } from './partials/UserInfoList/types';

export interface UserInfoSectionListSection {
  key: string;
  heading: MotionBadgeProps;
  items: UserInfoListProps['items'];
}

export interface UserInfoSectionListProps {
  sections: UserInfoSectionListSection[];
  className?: string;
}
