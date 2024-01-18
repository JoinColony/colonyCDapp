import { LinkProps } from '~v5/shared/Link/types';
import { MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types';
import { UserAvatarsProps } from '~v5/shared/UserAvatars/types';

import { TeamBadgeProps } from '../Pills/TeamBadge/types';

export interface TeamCardProps {
  teamProps: TeamBadgeProps;
  reputation: number;
  members?: UserAvatarsProps['items'];
  isMembersListLoading?: boolean;
  meatBallMenuProps: MeatBallMenuProps;
  balance: React.ReactNode;
  title?: string;
  description?: React.ReactNode;
  links?: (LinkProps & {
    key: string;
  })[];
  className?: string;
}
