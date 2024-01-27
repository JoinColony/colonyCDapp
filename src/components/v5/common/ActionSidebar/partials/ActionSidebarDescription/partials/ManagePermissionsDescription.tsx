import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { ColonyActionRoles, ColonyActionType } from '~gql';
import { formatRolesTitle } from '~utils/colonyActions.ts';
import { formatText } from '~utils/intl.ts';

import { ManagePermissionsFormValues } from '../../forms/ManagePermissionsForm/consts.tsx';
import { getPermissionsMap } from '../../forms/ManagePermissionsForm/utils.tsx';

import CurrentUser from './CurrentUser.tsx';
import RecipientUser from './RecipientUser.tsx';

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
    <FormattedMessage
      id="action.title"
      values={{
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
      }}
    />
  );
};

ManagePermissionsDescription.displayName = displayName;
export default ManagePermissionsDescription;
