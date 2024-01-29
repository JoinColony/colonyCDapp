import { type MessageDescriptor } from 'react-intl';
import { type PopperOptions } from 'react-popper-tooltip';

import { type DomainWithPermissionsAndReputation } from '~hooks/members/types.ts';
import { type User } from '~types/graphql.ts';
import { type AvatarProps } from '~v5/shared/Avatar/types.ts';
import { type UserAvatarDetailsProps } from '~v5/shared/UserAvatarDetails/types.ts';

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
