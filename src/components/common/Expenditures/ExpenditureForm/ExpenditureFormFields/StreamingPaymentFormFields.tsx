import React from 'react';
import { useFormContext } from 'react-hook-form';

import { StreamingPaymentEndCondition } from '~gql';
import { Input, Select } from '~shared/Fields';

import ExpenditureTimeInput from '../ExpenditureTimeInput';

const StreamingPaymentFormFields = () => {
  const { watch } = useFormContext();
  const endCondition = watch('endCondition') as StreamingPaymentEndCondition;

  return (
    <div>
      <Input name="recipientAddress" label="Recipient address" />
      <ExpenditureTimeInput namePrefix="start" labelPrefix="Start" />
      <Select
        name="endCondition"
        label="Ends"
        options={[
          {
            label: 'When cancelled',
            value: StreamingPaymentEndCondition.WhenCancelled,
          },
          {
            label: 'Limit is reached',
            value: StreamingPaymentEndCondition.LimitReached,
          },
          {
            label: 'Fixed time',
            value: StreamingPaymentEndCondition.FixedTime,
          },
        ]}
      />

      {endCondition === StreamingPaymentEndCondition.FixedTime && (
        <ExpenditureTimeInput namePrefix="end" labelPrefix="End" />
      )}
      <Select
        name="interval"
        label="Amount per"
        options={[
          { label: 'minute', value: 60 },
          { label: 'hour', value: 3600 },
          { label: 'day', value: 86400 },
          { label: 'month', value: 2592000 },
        ]}
      />
    </div>
  );
};

export default StreamingPaymentFormFields;
