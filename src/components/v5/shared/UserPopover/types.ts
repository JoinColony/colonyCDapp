import { PopperOptions } from 'react-popper-tooltip';

import { UserAvatarDetailsProps } from '~v5/shared/UserAvatarDetails/types';
import { AvatarProps } from '~v5/shared/Avatar/types';
import { DomainWithPermissionsAndReputation } from '~hooks/members/types';
import { User } from '~types';

export interface UserPopoverProps extends AvatarProps, UserAvatarDetailsProps {
  domains?: DomainWithPermissionsAndReputation[];
  user?: User | null;
  popperOptions?: PopperOptions;
  isContributorsList?: boolean;
  additionalContent?: JSX.Element;
  withVerifiedBadge?: boolean;
  wrapperClassName?: string;
}
