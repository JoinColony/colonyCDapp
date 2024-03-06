import { Binoculars } from '@phosphor-icons/react';
import { capitalize } from 'lodash';
import React from 'react';

import { UserRole } from '~constants/permissions.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';

import { useGetMembersForPermissions } from './hooks.tsx';
import PermissionsPageContent from './partials/PermissionsPageContent.tsx';
import PermissionsPageRow from './partials/PermissionsPageRow.tsx';

const IndividualPermissionsPage = () => {
  const { individualMembers, filters, isLoading } =
    useGetMembersForPermissions();
  const emptyMembers = Object.keys(individualMembers).every(
    (role) => individualMembers[role].length === 0,
  );

  return (
    <PermissionsPageContent {...filters}>
      {emptyMembers && !isLoading && (
        <EmptyContent
          title={formatText({ id: 'permissionsPage.empty.title' })}
          description={formatText({ id: 'permissionsPage.empty.description' })}
          className="pt-10 pb-9 px-6 mt-6"
          icon={Binoculars}
          withBorder
        />
      )}
      {isLoading &&
        Object.keys(UserRole).map((role) => (
          <PermissionsPageRow
            key={role}
            title={capitalize(role)}
            description={formatText({
              id: `permissionsPage.${role.toLowerCase()}`,
            })}
            members={[]}
            isLoading={isLoading}
          />
        ))}
      {!isLoading &&
        Object.keys(individualMembers).map((role) => (
          <PermissionsPageRow
            key={role}
            title={capitalize(role)}
            description={formatText({ id: `permissionsPage.${role}` })}
            members={individualMembers[role]}
            isLoading={isLoading}
          />
        ))}
    </PermissionsPageContent>
  );
};

export default IndividualPermissionsPage;
