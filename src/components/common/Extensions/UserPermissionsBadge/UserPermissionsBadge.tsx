import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';

import { type UserPermissionsBadgeProps } from './types.ts';

import styles from './UserPermissionsBadge.module.css';

const displayName = 'common.Extensions.UserPermissionsBadge';

const UserPermissionsBadge: FC<
  PropsWithChildren<UserPermissionsBadgeProps>
> = ({
  children,
  text,
  textValues,
  description,
  descriptionValues,
  icon: Icon,
  ...rest
}) => {
  const userPermissionsBadgeText = formatText(text, textValues);
  const userPermissionsBadgeDescription = formatText(
    description,
    descriptionValues,
  );

  const content = (
    <>
      <span className="flex items-center shrink-0">
        <Icon size={12} />
      </span>
      <span className="ml-1.5">{userPermissionsBadgeText || children}</span>
    </>
  );

  return (
    <Tooltip
      {...rest}
      tooltipContent={
        <>
          <span className={clsx(styles.tooltipBadge, 'mb-2.5')}>{content}</span>
          {userPermissionsBadgeText}: {userPermissionsBadgeDescription}
        </>
      }
    >
      <span className={clsx(styles.badge, 'text-3')}>{content}</span>
    </Tooltip>
  );
};

UserPermissionsBadge.displayName = displayName;

export default UserPermissionsBadge;
