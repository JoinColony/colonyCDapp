import React, { PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import camelcase from 'camelcase';
import { UserPermissionsProps } from './types';
import styles from './UserPermissions.css';
import { pills as iconNames } from '~images/icons.json';

const displayName = 'Badge.UserPermissions';

const icons = iconNames.reduce((iconObj, iconName) => {
  const id = camelcase(iconName);
  return {
    ...iconObj,
    // eslint-disable-next-line no-param-reassign, global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
    [id]: require(`~images/pills/${id}.svg`).default,
  };
}, {});

// eslint-disable-next-line no-warning-comments
// TODO: Add tooltip
const UserPermissions: React.FC<PropsWithChildren<UserPermissionsProps>> = ({
  children,
  text,
  textValues,
  name,
  ...rest
}) => {
  const { formatMessage } = useIntl();

  const userPermissionsText =
    typeof text == 'string' ? text : text && formatMessage(text, textValues);

  const Icon = icons[name];

  return (
    <span className={styles.userPermissions} {...rest}>
      <span className="flex flex-shrink-0 w-[0.875rem]">
        <Icon />
      </span>
      <span className="ml-1 mt-[0.0625rem]">
        {userPermissionsText || children}
      </span>
    </span>
  );
};

UserPermissions.displayName = displayName;

export default UserPermissions;
