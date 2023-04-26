import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import camelcase from 'camelcase';
import clsx from 'clsx';
import { UserPermissionsBadgeProps } from './types';
import styles from './UserPermissionsBadge.module.css';
// import { pills as iconNames } from '~images/icons.json';
import Tooltip from '~shared/Extensions/Tooltip';

const displayName = 'common.Extensions.UserPermissionsBadge';

// This have to be uncommented when icon will work
// const icons = iconNames.reduce((iconObj, iconName) => {
//   const id = camelcase(iconName);

//   return {
//     ...iconObj,
//     // eslint-disable-next-line no-param-reassign, global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
//     [id]: require(`~images/pills/${id}.svg`).default,
//   };
// }, {});

const UserPermissionsBadge: FC<PropsWithChildren<UserPermissionsBadgeProps>> = ({
  children,
  text,
  textValues,
  description,
  descriptionValues,
  name,
  ...rest
}) => {
  const { formatMessage } = useIntl();

  const userPermissionsBadgeText = typeof text == 'string' ? text : text && formatMessage(text, textValues);

  const userPermissionsBadgeDescription =
    typeof description == 'string' ? description : description && formatMessage(description, descriptionValues);

  // const Icon = icons[name];

  const content = (
    <>
      <span className="flex flex-shrink-0 w-[0.75rem]">{/* <Icon /> */}</span>
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
