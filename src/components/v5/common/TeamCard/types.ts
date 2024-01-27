import { LinkProps } from '~v5/shared/Link/types.ts';
import { MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';
import { UserAvatarsProps } from '~v5/shared/UserAvatars/types.ts';

import { TeamBadgeProps } from '../Pills/TeamBadge/types.ts';

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
