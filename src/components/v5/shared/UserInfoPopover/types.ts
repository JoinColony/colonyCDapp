import { type MessageDescriptor } from 'react-intl';
import { type PopperOptions } from 'react-popper-tooltip';

import { type UserFragment, type ContributorType } from '~gql';
import { type DomainWithPermissionsAndReputation } from '~hooks/members/types.ts';
import { type User } from '~types/graphql.ts';

export interface UserInfoProps {
  aboutDescription?: MessageDescriptor | string;
  domains?: DomainWithPermissionsAndReputation[];
  additionalContent?: JSX.Element | null;
  userDetails: JSX.Element;
  contributorType?: ContributorType;
}

export interface UserInfoPopoverProps {
  className?: string;
  walletAddress: string;
  user?: User | null;
  popperOptions?: PopperOptions;
  withVerifiedBadge?: boolean;
  children?: ((user?: UserFragment) => React.ReactNode) | React.ReactNode;
  showMultiSigPermissions?: boolean;
  withUserName?: boolean;
}
