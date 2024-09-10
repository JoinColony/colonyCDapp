import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage, defineMessages } from 'react-intl';

import { ManageVerifiedMembersOperation } from '~types';
import { ColonyActionType } from '~types/graphql.ts';
import { type ManageVerifiedMembersFormValues } from '~v5/common/ActionSidebar/partials/forms/core/ManageVerifiedMembersForm/utils.ts';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.ManageVerifiedMembersDescription';

const MSG = defineMessages({
  manageMembersTitle: {
    id: `${displayName}.manageMembersTitle`,
    defaultMessage: 'Manage verified members by {initiator}',
  },
});

export const ManageVerifiedMembersDescription = () => {
  const formValues =
    useFormContext<ManageVerifiedMembersFormValues>().getValues();
  const { members, manageMembers } = formValues;
  const isEmpty = members?.[0]?.value === undefined;
  const membersCount = !isEmpty
    ? members
        .filter((obj) => typeof obj?.value === 'string')
        .map((obj) => obj?.value).length
    : undefined;

  if (manageMembers === undefined) {
    return (
      <FormattedMessage
        {...MSG.manageMembersTitle}
        values={{
          initiator: <CurrentUser />,
        }}
      />
    );
  }

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType:
          manageMembers === ManageVerifiedMembersOperation.Add
            ? ColonyActionType.AddVerifiedMembers
            : ColonyActionType.RemoveVerifiedMembers,
        members: membersCount,
        initiator: <CurrentUser />,
      }}
    />
  );
};

ManageVerifiedMembersDescription.displayName = displayName;
export default ManageVerifiedMembersDescription;
