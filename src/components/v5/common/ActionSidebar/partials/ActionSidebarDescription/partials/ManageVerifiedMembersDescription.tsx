import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { ColonyActionType } from '~types/graphql.ts';

import {
  ManageMembersType,
  type ManageVerifiedMembersFormValues,
} from '../../forms/ManageVerifiedMembersForm/consts.ts';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.ManageVerifiedMembersDescription';

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

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType:
          manageMembers === ManageMembersType.Add
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
