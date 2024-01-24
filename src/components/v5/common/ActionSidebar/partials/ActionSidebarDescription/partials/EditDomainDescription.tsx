import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext';
import { ColonyActionType } from '~gql';

import { EditTeamFormValues } from '../../forms/EditTeamForm/consts';

import CurrentUser from './CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.EditDomainDescription';

export const EditDomainDescription = () => {
  const {
    colony: { domains },
  } = useColonyContext();
  const formValues = useFormContext<EditTeamFormValues>().getValues();

  const { team } = formValues;

  const selectedDomain = domains?.items.find(
    (domain) => domain?.nativeId === team,
  );

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ColonyActionType.EditDomain,
        fromDomain: selectedDomain?.metadata
          ? selectedDomain.metadata.name
          : '',
        initiator: <CurrentUser />,
      }}
    />
  );
};

EditDomainDescription.displayName = displayName;
export default EditDomainDescription;
