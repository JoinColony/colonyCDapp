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
  const { itemsByRole, filters, isLoading } = useGetMembersForPermissions();
  const emptyMembers = Object.keys(itemsByRole).every(
    (role) => itemsByRole[role].length === 0,
  );

  return (
    <PermissionsPageContent {...filters}>
      {emptyMembers && !isLoading && (
        <EmptyContent
          title={formatText({ id: 'permissionsPage.empty.title' })}
          description={formatText({ id: 'permissionsPage.empty.description' })}
          className="mt-6 px-6 pb-9 pt-10"
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
            items={[]}
            isLoading={isLoading}
          />
        ))}
      {!isLoading &&
        Object.keys(itemsByRole).map((role) => (
          <PermissionsPageRow
            key={role}
            title={capitalize(role)}
            description={formatText({ id: `permissionsPage.${role}` })}
            items={itemsByRole[role]}
            isLoading={isLoading}
          />
        ))}
    </PermissionsPageContent>
  );
};

export default IndividualPermissionsPage;
