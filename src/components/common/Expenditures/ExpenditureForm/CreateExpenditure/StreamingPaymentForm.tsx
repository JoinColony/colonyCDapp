import React from 'react';
import { Id } from '@colony/colony-js';

import { ActionTypes } from '~redux';
import { useColonyContext } from '~hooks';
import Button from '~shared/Button';

import CreateExpenditureForm from './CreateExpenditureForm';
import {
  StreamingPaymentEndCondition,
  StreamingPaymentFormValues,
} from '../types';
import { StreamingPaymentFormFields } from '../ExpenditureFormFields';

import styles from '../ExpenditureForm.module.css';

const StreamingPaymentForm = () => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  return (
    <CreateExpenditureForm<StreamingPaymentFormValues>
      actionType={ActionTypes.STAKED_EXPENDITURE_CANCEL}
      defaultValues={{
        createInDomainId: Id.RootDomain,
        fundFromDomainId: Id.RootDomain,
        recipientAddress: '',
        endCondition: StreamingPaymentEndCondition.WhenCancelled,
      }}
    >
      <StreamingPaymentFormFields colony={colony} />

      <div className={styles.buttons}>
        <Button type="submit">Create</Button>
      </div>
    </CreateExpenditureForm>
  );
};

export default StreamingPaymentForm;
