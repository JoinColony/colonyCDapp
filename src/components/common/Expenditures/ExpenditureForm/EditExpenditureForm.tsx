import React from 'react';

import { useColonyContext } from '~hooks';
import { ActionForm } from '~shared/Fields';
import { Expenditure } from '~types';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import Button from '~shared/Button';

import ExpenditureFormFields from './ExpenditureFormFields';
import {
  getExpenditurePayoutsFieldValue,
  getInitialPayoutFieldValue,
} from './helpers';
import { ExpenditureFormValues } from './types';

import styles from './ExpenditureForm.module.css';

export interface EditExpenditureFormProps {
  expenditure: Expenditure;
  onCancelClick?: () => void;
  onSuccess?: () => void;
}

const EditExpenditureForm = ({
  expenditure,
  onSuccess,
  onCancelClick,
}: EditExpenditureFormProps) => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  const transformPayload = pipe(
    mapPayload((payload: ExpenditureFormValues) => ({
      colonyAddress: colony.colonyAddress,
      expenditure,
      payouts: payload.payouts,
    })),
    withMeta({}),
  );

  return (
    <ActionForm<ExpenditureFormValues>
      defaultValues={{
        payouts: expenditure
          ? getExpenditurePayoutsFieldValue(expenditure)
          : [getInitialPayoutFieldValue(colony.nativeToken.tokenAddress)],
      }}
      actionType={ActionTypes.EXPENDITURE_EDIT}
      transform={transformPayload}
      onSuccess={onSuccess}
    >
      <ExpenditureFormFields colony={colony} />

      <div className={styles.buttons}>
        <Button
          appearance={{ size: 'small' }}
          onClick={() => onCancelClick?.()}
        >
          Cancel
        </Button>
        <Button type="submit">Save changes</Button>
      </div>
    </ActionForm>
  );
};

export default EditExpenditureForm;
