import React from 'react';
import { useFormContext } from 'react-hook-form';

import { ColonyActionRoles, ColonyActionType } from '~gql';
import useColonyContext from '~hooks/useColonyContext';
import { formatRolesTitle } from '~utils/colonyActions';
import { formatText } from '~utils/intl';

import { ManagePermissionsFormValues } from '../../forms/ManagePermissionsForm/consts';
import { getPermissionsMap } from '../../forms/ManagePermissionsForm/utils';

import CurrentUser from './CurrentUser';
import RecipientUser from './RecipientUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.ManagePermissionsDescription';

export const ManagePermissionsDescription = () => {
  const {
    colony: { domains },
  } = useColonyContext();
  const formValues = useFormContext<ManagePermissionsFormValues>().getValues();
  const { member, role, permissions, team } = formValues;

  const selectedDomain = domains?.items.find(
    (domain) => domain?.nativeId === team,
  );
  const membersPermissions =
    typeof role === 'string' ? getPermissionsMap(permissions || {}, role) : {};
  const memberRoles = Object.entries(
    membersPermissions,
  ).reduce<ColonyActionRoles>(
    (result, [key, value]) => ({
      ...result,
      [`role_${key}`]: value,
    }),
    {},
  );
  const rolesTitle = formatRolesTitle(memberRoles);

  const recipientUser = member ? (
    <RecipientUser
      userAddress={member}
      noUserText={formatText({
        id: 'actionSidebar.metadataDescription.user',
      })}
    />
  ) : (
    formatText({
      id: 'actionSidebar.metadataDescription.user',
    })
  );

  return (
    <>
      {formatText(
        { id: 'action.title' },
        {
          actionType: ColonyActionType.SetUserRoles,
          recipient: recipientUser,
          direction: rolesTitle.direction,
          rolesChanged: rolesTitle.roleTitle,
          fromDomain: selectedDomain?.metadata
            ? selectedDomain.metadata.name
            : formatText({
                id: 'actionSidebar.metadataDescription.team',
              }),
          initiator: <CurrentUser />,
        },
      )}
    </>
  );
};

ManagePermissionsDescription.displayName = displayName;
export default ManagePermissionsDescription;
