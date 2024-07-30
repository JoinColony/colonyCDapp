import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { ColonyActionType } from '~gql';
import { type CreateNewTeamFormValues } from '~v5/common/ActionSidebar/partials/forms/CreateNewTeamForm/consts.ts';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.CreateNewDomainDescription';

export const CreateNewDomainDescription = () => {
  const formValues = useFormContext<CreateNewTeamFormValues>().getValues();
  const { teamName } = formValues;

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ColonyActionType.CreateDomain,
        fromDomain: teamName,
        initiator: <CurrentUser />,
      }}
    />
  );
};

CreateNewDomainDescription.displayName = displayName;
export default CreateNewDomainDescription;
