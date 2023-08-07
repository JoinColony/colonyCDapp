import React from 'react';
import { Id } from '@colony/colony-js';
import { useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { ExpenditureFormValues } from './ExpenditureForm';

const ExpenditureActionButton = () => {
  const navigate = useNavigate();

  const { colony } = useColonyContext();

  const { slots } = useWatch<ExpenditureFormValues>();

  if (!colony) {
    return null;
  }

  const transform = pipe(
    mapPayload(() => ({
      colonyName: colony.name,
      colonyAddress: colony.colonyAddress,
      slots,
      // @TODO: This should come from the form values
      domainId: Id.RootDomain,
    })),
    withMeta({ navigate }),
  );

  return (
    <ActionButton
      actionType={ActionTypes.EXPENDITURE_CREATE}
      transform={transform}
    >
      Create expenditure
    </ActionButton>
  );
};

export default ExpenditureActionButton;
