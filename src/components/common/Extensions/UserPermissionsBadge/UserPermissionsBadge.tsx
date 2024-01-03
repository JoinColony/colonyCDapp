import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';

import Tooltip from '~shared/Extensions/Tooltip';
import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';

import { UserPermissionsBadgeProps } from './types';

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
  name,
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
        <Icon name={name} appearance={{ size: 'extraTiny' }} />
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
