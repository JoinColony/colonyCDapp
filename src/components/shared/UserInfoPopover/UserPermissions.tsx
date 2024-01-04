import { ColonyRole } from '@colony/colony-js';
import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~shared/Heading';
import PermissionsLabel from '~shared/PermissionsLabel';

import styles from './UserInfoPopover.css';

const displayName = `UserInfoPopover.UserPermissions`;

interface Props {
  roles: ColonyRole[];
}

const MSG = defineMessages({
  labelText: {
    id: `${displayName}.labelText`,
    defaultMessage: 'Permissions',
  },
});

const UserPermissions = ({ roles }: Props) => {
  return (
    <div className={styles.sectionContainer}>
      <Heading
        appearance={{
          size: 'normal',
          theme: 'grey',
          weight: 'bold',
        }}
        text={MSG.labelText}
      />
      <ul className={styles.roleList}>
        {roles.map((role) => (
          <li key={role}>
            <PermissionsLabel permission={role} />
          </li>
        ))}
      </ul>
    </div>
  );
};

UserPermissions.displayName = displayName;

export default UserPermissions;
