import React from 'react';

import { useColonyContext } from '~hooks';
import { ActionForm } from '~shared/Fields';
import { Expenditure } from '~types';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import Button from '~shared/Button';

import { AdvancedPaymentFormFields } from '../ExpenditureFormFields';
import {
  getExpenditurePayoutsFieldValue,
  getInitialPayoutFieldValue,
} from '../helpers';
import { AdvancedPaymentFormValues } from '../types';

import styles from '../ExpenditureForm.module.css';

export interface EditExpenditureFormProps {
  expenditure: Expenditure;
  onEditingFinished: () => void;
}

const EditExpenditureForm = ({
  expenditure,
  onEditingFinished,
}: EditExpenditureFormProps) => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  const transformPayload = pipe(
    mapPayload((payload: AdvancedPaymentFormValues) => ({
      colonyAddress: colony.colonyAddress,
      expenditure,
      payouts: payload.payouts,
    })),
    withMeta({}),
  );

  return (
    <ActionForm<AdvancedPaymentFormValues>
      defaultValues={{
        payouts: expenditure
          ? getExpenditurePayoutsFieldValue(expenditure)
          : [getInitialPayoutFieldValue(colony.nativeToken.tokenAddress)],
      }}
      actionType={ActionTypes.EXPENDITURE_EDIT}
      transform={transformPayload}
      onSuccess={onEditingFinished}
    >
      <AdvancedPaymentFormFields colony={colony} />

      <div className={styles.buttons}>
        <Button appearance={{ size: 'small' }} onClick={onEditingFinished}>
          Cancel
        </Button>
        <Button type="submit">Save changes</Button>
      </div>
    </ActionForm>
  );
};

export default EditExpenditureForm;
