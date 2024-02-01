import { capitalize } from 'lodash';
import React from 'react';

import { formatText } from '~utils/intl.ts';

import { useGetMembersForPermissions } from './hooks.tsx';
import PermissionsPageRow from './partials/PermissionsPageRow.tsx';

const IndividualPermissionsPage = () => {
  const { individualMembers, isLoading } = useGetMembersForPermissions();

  return (
    <>
      {Object.keys(individualMembers).map((role) => (
        <PermissionsPageRow
          key={role}
          title={capitalize(role)}
          description={formatText({ id: `permissionsPage.${role}` })}
          members={individualMembers[role]}
          isLoading={isLoading}
        />
      ))}
    </>
  );
};

export default IndividualPermissionsPage;
