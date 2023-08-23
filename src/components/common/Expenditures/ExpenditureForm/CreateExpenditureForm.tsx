import React from 'react';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';

import { ActionForm } from '~shared/Fields';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { findDomainByNativeId } from '~utils/domains';
import Button from '~shared/Button';
import { ActionTypes } from '~redux';

import { getInitialPayoutFieldValue } from './helpers';
import { ExpenditureFormValues } from './types';
import ExpenditureFormFields from './ExpenditureFormFields';

import styles from './ExpenditureForm.module.css';

const CreateExpenditureForm = () => {
  const navigate = useNavigate();

  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  const transformPayload = pipe(
    mapPayload((payload: ExpenditureFormValues) => ({
      colony,
      payouts: payload.payouts,
      // @TODO: These should come from the form values
      createdInDomain: colony
        ? findDomainByNativeId(Id.RootDomain, colony)
        : null,
      fundFromDomainId: Id.RootDomain,
    })),
    withMeta({ navigate }),
  );

  return (
    <ActionForm
      actionType={ActionTypes.EXPENDITURE_CREATE}
      defaultValues={{
        payouts: [getInitialPayoutFieldValue(colony.nativeToken.tokenAddress)],
      }}
      transform={transformPayload}
    >
      <ExpenditureFormFields colony={colony} />

      <div className={styles.buttons}>
        <Button type="submit">Create expenditure</Button>
      </div>
    </ActionForm>
  );
};

export default CreateExpenditureForm;
