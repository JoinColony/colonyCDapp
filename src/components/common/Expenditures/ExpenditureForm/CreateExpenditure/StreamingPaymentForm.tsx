import { Id } from '@colony/colony-js';
import { format, addMonths } from 'date-fns';
import React from 'react';

import { StreamingPaymentEndCondition } from '~gql';
import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { CreateStreamingPaymentPayload } from '~redux/sagas/expenditures/createStreamingPayment';
import Button from '~shared/Button';
import { mapPayload, pipe } from '~utils/actions';
import { findDomainByNativeId } from '~utils/domains';

import { StreamingPaymentFormFields } from '../ExpenditureFormFields';
import { getTimestampFromCleaveDateAndTime } from '../helpers';
import { StreamingPaymentFormValues } from '../types';

import CreateExpenditureForm from './CreateExpenditureForm';

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
          tokenAddress: payload.tokenAddress,
          amount: payload.amount,
          startTime: getTimestampFromCleaveDateAndTime(
            payload.startDate,
            payload.startTime,
          ),
          endTime:
            payload.endDate && payload.endTime
              ? getTimestampFromCleaveDateAndTime(
                  payload.endDate,
                  payload.endTime,
                )
              : undefined,
          interval: payload.interval,
          endCondition: payload.endCondition,
          limitAmount: payload.limitAmount,
        } as CreateStreamingPaymentPayload),
    ),
  );

  const nowDate = new Date();
  const startDate = format(nowDate, 'ddMMyyyy');
  const startTime = format(nowDate, 'HHmm');
  const futureDate = addMonths(nowDate, 1);
  const endDate = format(futureDate, 'ddMMyyyy');
  const endTime = format(futureDate, 'HHmm');

  return (
    <CreateExpenditureForm<StreamingPaymentFormValues>
      actionType={ActionTypes.STREAMING_PAYMENT_CREATE}
      defaultValues={{
        createInDomainId: Id.RootDomain,
        fundFromDomainId: Id.RootDomain,
        recipientAddress: '',
        startDate,
        startTime,
        endCondition: StreamingPaymentEndCondition.WhenCancelled,
        endDate,
        endTime,
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
