import React from 'react';
import { Id } from '@colony/colony-js';

import { ActionTypes } from '~redux';
import { useColonyContext } from '~hooks';
import Button from '~shared/Button';
import { mapPayload, pipe } from '~utils/actions';
import { CreateStreamingPaymentPayload } from '~redux/sagas/expenditures/createStreamingPayment';
import { findDomainByNativeId } from '~utils/domains';

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

  const transformPayload = pipe(
    mapPayload(
      (payload: StreamingPaymentFormValues) =>
        ({
          colonyAddress: colony.colonyAddress,
          createdInDomain: findDomainByNativeId(
            payload.createInDomainId,
            colony,
          ),
          recipientAddress: payload.recipientAddress,
          tokenAddresses: [payload.tokenAddress],
          amounts: [payload.amount],
          startTime: payload.startTime,
          endTime: payload.endTime,
          interval: payload.interval,
        } as CreateStreamingPaymentPayload),
    ),
  );

  return (
    <CreateExpenditureForm<StreamingPaymentFormValues>
      actionType={ActionTypes.STREAMING_PAYMENT_CREATE}
      defaultValues={{
        createInDomainId: Id.RootDomain,
        fundFromDomainId: Id.RootDomain,
        recipientAddress: '',
        startTime: new Date().getTime() / 1000,
        endCondition: StreamingPaymentEndCondition.WhenCancelled,
        amount: '0',
        tokenAddress: colony.nativeToken.tokenAddress,
        interval: 60,
      }}
      transform={transformPayload}
    >
      <StreamingPaymentFormFields colony={colony} />

      <div className={styles.buttons}>
        <Button type="submit">Create</Button>
      </div>
    </CreateExpenditureForm>
  );
};

export default StreamingPaymentForm;
