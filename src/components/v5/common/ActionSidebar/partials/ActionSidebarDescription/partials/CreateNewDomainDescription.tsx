import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

// FIXME: Make sure we're not using ColonyActionType anywhere
import { CoreAction } from '~actions/index.ts';
import { type CreateNewTeamFormValues } from '~v5/common/ActionSidebar/partials/forms/core/CreateTeamForm/consts.ts';

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
        actionType: CoreAction.CreateDomain,
        fromDomain: teamName,
        initiator: <CurrentUser />,
      }}
    />
  );
};

CreateNewDomainDescription.displayName = displayName;
export default CreateNewDomainDescription;
