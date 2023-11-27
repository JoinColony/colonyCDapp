import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input, Select } from '~shared/Fields';
import TokenAmountInput from '~common/Dialogs/TokenAmountInput';
import { Colony } from '~types';
import { StreamingPaymentEndCondition } from '~gql';

import ExpenditureTimeInput from '../ExpenditureTimeInput';

interface StreamingPaymentFormFieldsProps {
  colony: Colony;
}

const StreamingPaymentFormFields = ({
  colony,
}: StreamingPaymentFormFieldsProps) => {
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

      <TokenAmountInput colony={colony} />

      {endCondition === StreamingPaymentEndCondition.LimitReached && (
        <TokenAmountInput
          colony={colony}
          tokenAddressFieldName="tokenAddress"
          amountFieldName="limitAmount"
          label="Limit"
          disabledTokenAddress
        />
      )}
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
