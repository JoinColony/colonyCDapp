import { MessageDescriptor } from 'react-intl';
import { PopperOptions } from 'react-popper-tooltip';

import { UserAvatarDetailsProps } from '~v5/shared/UserAvatarDetails/types';
import { AvatarProps } from '~v5/shared/Avatar/types';
import { DomainWithPermissionsAndReputation } from '~hooks/members/types';
import { User } from '~types';

export interface UserInfoProps extends AvatarProps, UserAvatarDetailsProps {
  aboutDescription: MessageDescriptor | string;
  domains?: DomainWithPermissionsAndReputation[];
}

export interface UserPopoverProps extends UserInfoProps {
  user?: User | null;
  popperOptions?: PopperOptions;
  isContributorsList?: boolean;
  additionalContent?: JSX.Element;
  withVerifiedBadge?: boolean;
  wrapperClassName?: string;
  colonyAddress?: string;
}
