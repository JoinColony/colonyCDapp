import React from 'react';

import PermissionsLabel from '~shared/PermissionsLabel';
import { ActionUserRoles } from '~types';
import { formatText } from '~utils/intl';

import styles from './RolesDetail.css';

const displayName = 'DetailsWidget.RolesDetail.RolesDetailItem';

interface Props {
  role: ActionUserRoles;
}

const RolesDetailItem = ({ role }: Props) => {
  const roleNameMessage = { id: `role.${role.id}` };
  const formattedRole = formatText(roleNameMessage);

  return (
    <li className={styles.roleListItem}>
      <PermissionsLabel permission={role.id} name={formattedRole} />
    </li>
  );
};

RolesDetailItem.displayName = displayName;

export default RolesDetailItem;
