import { ColonyRole } from '@colony/colony-js';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import PermissionsLabel from '~shared/PermissionsLabel';

import styles from './NoPermissionMessage.css';

const displayName = 'NoPermissionMessage';

const MSG = defineMessages({
  noPermission: {
    id: `${displayName}.noPermission`,
    defaultMessage: `You need the {requiredRoleList} 
    {permissionCount, plural, one {permission} other {permissions}}
    {hasDomain, select,
      true {in {domainName}}
      other {}
    } to take this action.`,
  },
});

interface Props {
  requiredPermissions: ColonyRole[];
  domainName?: string;
}

const RequiredRoleList = ({ requiredPermissions }) => {
  const getSeparator = (itemNumber: number) => {
    if (requiredPermissions.length > 1) {
      if (itemNumber === requiredPermissions.length - 2) {
        return ', and ';
      }
      if (itemNumber !== requiredPermissions.length - 1) {
        return ', ';
      }
    }
    return '';
  };

  return requiredPermissions.map((permission, i) => (
    <span key={`role-label-${permission}`}>
      <PermissionsLabel permission={permission} name={{ id: `role.${permission}` }} />
      {getSeparator(i)}
    </span>
  ));
};

const NoPermissionMessage = ({ requiredPermissions, domainName }: Props) => (
  <span className={styles.noPermissionFromMessage}>
    <FormattedMessage
      {...MSG.noPermission}
      values={{
        permissionCount: requiredPermissions.length,
        requiredRoleList: <RequiredRoleList requiredPermissions={requiredPermissions} />,
        hasDomain: !!domainName,
        domainName,
      }}
    />
  </span>
);

export default NoPermissionMessage;
