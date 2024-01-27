import { MessageDescriptor } from 'react-intl';
import { PopperOptions } from 'react-popper-tooltip';

import { DomainWithPermissionsAndReputation } from '~hooks/members/types.ts';
import { User } from '~types/graphql.ts';
import { AvatarProps } from '~v5/shared/Avatar/types.ts';
import { UserAvatarDetailsProps } from '~v5/shared/UserAvatarDetails/types.ts';

export interface UserInfoProps extends AvatarProps, UserAvatarDetailsProps {
  aboutDescription?: MessageDescriptor | string;
  domains?: DomainWithPermissionsAndReputation[];
}

export interface UserPopoverProps extends UserInfoProps {
  user?: User | null;
  popperOptions?: PopperOptions;
  isContributorsList?: boolean;
  additionalContent?: JSX.Element;
  withVerifiedBadge?: boolean;
  wrapperClassName?: string;
}
