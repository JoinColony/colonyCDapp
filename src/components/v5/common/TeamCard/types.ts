import { type LinkProps } from '~v5/shared/Link/types.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';
import { type UserAvatarsProps } from '~v5/shared/UserAvatars/types.ts';

import { type TeamBadgeProps } from '../Pills/TeamBadge/types.ts';

export interface TeamCardProps {
  teamProps: TeamBadgeProps;
  reputation: number;
  members?: UserAvatarsProps['items'];
  isMembersListLoading?: boolean;
  meatBallMenuProps: MeatBallMenuProps;
  balance: React.ReactNode;
  title?: string;
  description?: string | null;
  links?: (LinkProps & {
    key: string;
  })[];
  searchParams?: {
    team: string;
  };
  className?: string;
}
