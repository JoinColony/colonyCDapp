import React from 'react';
import { useFormContext } from 'react-hook-form';

import { ColonyActionType } from '~gql';
import { formatText } from '~utils/intl';

import { CreateNewTeamFormValues } from '../../forms/CreateNewTeamForm/consts';

import CurrentUser from './CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.CreateNewDomainDescription';

export const CreateNewDomainDescription = () => {
  const formValues = useFormContext<CreateNewTeamFormValues>().getValues();
  const { teamName } = formValues;

  return (
    <>
      {formatText(
        { id: 'action.title' },
        {
          actionType: ColonyActionType.CreateDomain,
          fromDomain: teamName,
          initiator: <CurrentUser />,
        },
      )}
    </>
  );
};

CreateNewDomainDescription.displayName = displayName;
export default CreateNewDomainDescription;
