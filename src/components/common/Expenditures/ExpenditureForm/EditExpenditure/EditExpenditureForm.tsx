import React from 'react';

import { ActionForm } from '~shared/Fields';
import { Colony, Expenditure } from '~types';
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
  colony: Colony;
  actionType: ActionTypes;
}

const EditExpenditureForm = ({
  expenditure,
  onEditingFinished,
  colony,
  actionType,
}: EditExpenditureFormProps) => {
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
      actionType={actionType}
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
