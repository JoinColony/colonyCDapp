import { ColonyRole } from '@colony/colony-js';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import PermissionsLabel from '~shared/PermissionsLabel';

import styles from './NoPermissionMessage.css';

const displayName = 'NoPermissionMessage';

const MSG = defineMessages({
  noPermission: {
    id: `${displayName}.noPermission`,
    defaultMessage: `You need the {roleRequired} 
    {roleRequired, plural, one {permission} other {permissions}
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

const NoPermissionMessage = ({ requiredPermissions, domainName }: Props) => {
  const roleRequired = requiredPermissions.map((permissions) => (
    <PermissionsLabel
      permission={permissions}
      name={{ id: `role.${permissions}` }}
    />
  ));

  return (
    <div className={styles.noPermissionFromMessage}>
      <FormattedMessage
        {...MSG.noPermission}
        values={{
          roleRequired,
          hasDomain: !!domainName,
          domainName,
        }}
      />
    </div>
  );
};

export default NoPermissionMessage;
