import { Binoculars } from '@phosphor-icons/react';
import { capitalize } from 'lodash';
import React from 'react';

import { UserRole } from '~constants/permissions.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';

import { useGetMembersForPermissions } from './hooks.tsx';
import PermissionsPageContent from './partials/PermissionsPageContent.tsx';
import PermissionsPageRow from './partials/PermissionsPageRow.tsx';

const MultisigPermissionsPage = () => {
  const { itemsByMultiSigRole, filters, isLoading } =
    useGetMembersForPermissions(true);
  const emptyMembers = Object.keys(itemsByMultiSigRole).every(
    (role) => itemsByMultiSigRole[role].length === 0,
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
        Object.keys(UserRole)
          .filter((role) => UserRole[role] !== UserRole.Mod)
          .map((role) => (
            <PermissionsPageRow
              key={role}
              title={capitalize(UserRole[role])}
              description={formatText({
                id: `permissionsPage.${UserRole[role].toLowerCase()}`,
              })}
              items={[]}
              isLoading={isLoading}
            />
          ))}
      {!isLoading &&
        Object.keys(itemsByMultiSigRole).map((role) => {
          if (itemsByMultiSigRole[role].length > 0) {
            return (
              <PermissionsPageRow
                key={role}
                title={capitalize(role)}
                description={formatText({ id: `permissionsPage.${role}` })}
                items={itemsByMultiSigRole[role]}
                isLoading={isLoading}
                isMultiSig
              />
            );
          }

          return null;
        })}
    </PermissionsPageContent>
  );
};

export default MultisigPermissionsPage;
