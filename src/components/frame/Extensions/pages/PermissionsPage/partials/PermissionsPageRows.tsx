import { Binoculars } from '@phosphor-icons/react';
import { capitalize } from 'lodash';
import React from 'react';

import { UserRole } from '~constants/permissions.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';

import { useGetMembersForPermissions } from '../hooks.tsx';

import PermissionsPageContent from './PermissionsPageContent.tsx';
import PermissionsPageRow from './PermissionsPageRow.tsx';

const PermissionsPageInnerContent = ({
  isMultiSig,
}: {
  isMultiSig: boolean;
}) => {
  const { itemsByMultiSigRole, itemsByRole, filters, isLoading } =
    useGetMembersForPermissions(isMultiSig);

  const selectedItemsByRole = isMultiSig ? itemsByMultiSigRole : itemsByRole;
  const emptyMembers = Object.keys(selectedItemsByRole).every(
    (role) => selectedItemsByRole[role].length === 0,
  );

  const userRoles = isMultiSig
    ? Object.keys(UserRole).filter((role) => UserRole[role] !== UserRole.Mod)
    : Object.keys(UserRole);

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
        userRoles.map((role) => (
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
        Object.keys(selectedItemsByRole).map((role) => {
          if (selectedItemsByRole[role].length > 0) {
            return (
              <PermissionsPageRow
                key={role}
                title={capitalize(role)}
                description={formatText({ id: `permissionsPage.${role}` })}
                items={selectedItemsByRole[role]}
                isLoading={isLoading}
                isMultiSig={isMultiSig}
              />
            );
          }

          return null;
        })}
    </PermissionsPageContent>
  );
};

export default PermissionsPageInnerContent;
