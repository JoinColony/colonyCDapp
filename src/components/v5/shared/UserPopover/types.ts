import { type PropsWithChildren } from 'react';
import { type MessageDescriptor } from 'react-intl';
import { type PopperOptions } from 'react-popper-tooltip';

import { type DomainWithPermissionsAndReputation } from '~hooks/members/types.ts';
import { type User } from '~types/graphql.ts';
import { type UserStatusMode } from '~v5/common/Pills/types.ts';

export interface UserInfoProps {
  aboutDescription?: MessageDescriptor | string;
  domains?: DomainWithPermissionsAndReputation[];
  additionalContent?: JSX.Element | null;
  userDetails: JSX.Element;
  userStatus?: UserStatusMode | null;
}

export type UserPopoverProps = PropsWithChildren<{
  className?: string;
  userName?: string;
  walletAddress: string;
  size: number;
  user?: User | null;
  popperOptions?: PopperOptions;
  isContributorsList?: boolean;
  withVerifiedBadge?: boolean;
}>;
