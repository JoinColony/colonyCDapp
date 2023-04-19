import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { UserPermissionsBadgeProps } from './types';
import styles from './UserPermissionsBadge.module.css';
import Tooltip from '~shared/Extensions/Tooltip';
import Icon from '~shared/Icon';

const displayName = 'common.Extensions.UserPermissionsBadge';

const UserPermissionsBadge: FC<PropsWithChildren<UserPermissionsBadgeProps>> = ({
  children,
  text,
  textValues,
  description,
  descriptionValues,
  // name,
  ...rest
}) => {
  const { formatMessage } = useIntl();

  const userPermissionsBadgeText = typeof text == 'string' ? text : text && formatMessage(text, textValues);

  const userPermissionsBadgeDescription =
    typeof description == 'string' ? description : description && formatMessage(description, descriptionValues);

  const content = (
    <>
      <span className="flex items-center flex-shrink-0">
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
      <span className={styles.badge}>{content}</span>
    </Tooltip>
  );
};

UserPermissionsBadge.displayName = displayName;

export default UserPermissionsBadge;
