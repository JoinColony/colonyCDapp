import { type MotionVoteBadgeProps } from '~v5/common/Pills/MotionVoteBadge/types.ts';

import { type UserInfoListProps } from './partials/UserInfoList/types.ts';

export interface UserInfoSectionListSection {
  key: string;
  heading: MotionVoteBadgeProps;
  items: UserInfoListProps['items'];
}

export interface UserInfoSectionListProps {
  sections: UserInfoSectionListSection[];
  className?: string;
}
