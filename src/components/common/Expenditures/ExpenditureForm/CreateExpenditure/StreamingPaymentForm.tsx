import React, { useState } from 'react';
import { Id } from '@colony/colony-js';
import { format, addMonths } from 'date-fns';
import { Link } from 'react-router-dom';

import { ActionTypes } from '~redux';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import Button from '~shared/Button';
import { mapPayload, pipe } from '~utils/actions';
import { CreateStreamingPaymentPayload } from '~redux/sagas/expenditures/createStreamingPayment';
import { findDomainByNativeId } from '~utils/domains';
import {
  ColonyActionType,
  StreamingPaymentEndCondition,
  useGetMotionsByActionTypeQuery,
} from '~gql';
import ForceToggle from '~shared/Dialog/DialogHeading/ForceToggle';
import { notNull } from '~utils/arrays';
import { TEMP_convertEthToWei } from '~utils/expenditures';

import { StreamingPaymentFormValues } from '../types';
import { StreamingPaymentFormFields } from '../ExpenditureFormFields';
import { getTimestampFromCleaveDateAndTime } from '../helpers';

import CreateExpenditureForm from './CreateExpenditureForm';

import styles from '../ExpenditureForm.module.css';

const StreamingPaymentForm = () => {
  const { colony } = useColonyContext();
  const [isForce, setIsForce] = useState(false);
  const { data, loading } = useGetMotionsByActionTypeQuery({
    variables: {
      actionType: ColonyActionType.CreateStreamingPaymentMotion,
    },
    skip: !colony,
  });
  const { isVotingReputationEnabled } = useEnabledExtensions();

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
          // @TODO: This should get the token decimals of the selected token
          amount: TEMP_convertEthToWei(payload.amount).toString(),
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
          limitAmount: payload.limitAmount
            ? TEMP_convertEthToWei(payload.limitAmount).toString()
            : undefined,
        } as CreateStreamingPaymentPayload),
    ),
  );

  const nowDate = new Date();
  const startDate = format(nowDate, 'ddMMyyyy');
  const startTime = format(nowDate, 'HHmm');
  const futureDate = addMonths(nowDate, 1);
  const endDate = format(futureDate, 'ddMMyyyy');
  const endTime = format(futureDate, 'HHmm');

  const actionType = !isForce
    ? ActionTypes.MOTION_STREAMING_PAYMENT_CREATE
    : ActionTypes.STREAMING_PAYMENT_CREATE;

  return (
    <CreateExpenditureForm<StreamingPaymentFormValues>
      actionType={actionType}
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
        forceAction: true,
      }}
      transform={transformPayload}
    >
      <StreamingPaymentFormFields
        colony={colony}
        isForce={isForce}
        handleIsForceChange={setIsForce}
      />
      <ul>
        {loading && <div>Loading streaming payment motions...</div>}
        {data?.getColonyActionsByType?.items
          .filter(notNull)
          .map((streamingPayment) => (
            <li key={streamingPayment.motionData?.transactionHash}>
              <Link
                to={`/colony/${colony.name}/tx/${streamingPayment.motionData?.transactionHash}`}
              >
                Streaming Payment Motion #
                {streamingPayment.motionData?.nativeMotionId}
              </Link>
            </li>
          ))}
      </ul>
      <div className={styles.buttons}>
        {isVotingReputationEnabled && <ForceToggle />}
        <Button type="submit">Create {!isForce && '(with motion)'}</Button>
      </div>
    </CreateExpenditureForm>
  );
};

export default StreamingPaymentForm;
