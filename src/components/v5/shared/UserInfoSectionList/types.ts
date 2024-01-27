import { MotionBadgeProps } from '~v5/common/ActionSidebar/partials/Motions/partials/MotionBadge/types.ts';

import { UserInfoListProps } from './partials/UserInfoList/types.ts';

export interface UserInfoSectionListSection {
  key: string;
  heading: MotionBadgeProps;
  items: UserInfoListProps['items'];
}

export interface UserInfoSectionListProps {
  sections: UserInfoSectionListSection[];
  className?: string;
}
