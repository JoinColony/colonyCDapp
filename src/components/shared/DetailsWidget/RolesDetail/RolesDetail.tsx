import React from 'react';

import { ActionUserRoles } from '~utils/colonyActions';

import RolesDetailItem from './RolesDetailItem';

import styles from './RolesDetail.css';

const displayName = 'DetailsWidget.RolesDetail';

interface RolesDetailProps {
  roles: ActionUserRoles[];
}

const RolesDetail = ({ roles }: RolesDetailProps) => (
  <ul className={styles.roleList}>
    {roles.map((role) => (
      <RolesDetailItem key={role.id} role={role} />
    ))}
  </ul>
);

RolesDetail.displayName = displayName;

export default RolesDetail;
