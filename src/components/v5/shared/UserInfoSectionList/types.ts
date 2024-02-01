import { type MotionOutcomeBadgeProps } from '~v5/common/Pills/MotionOutcomeBadge/types.ts';

import { type UserInfoListProps } from './partials/UserInfoList/types.ts';

export interface UserInfoSectionListSection {
  key: string;
  heading: MotionOutcomeBadgeProps;
  items: UserInfoListProps['items'];
}

export interface UserInfoSectionListProps {
  sections: UserInfoSectionListSection[];
  className?: string;
}
