import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input, Select } from '~shared/Fields';
import TokenAmountInput from '~common/Dialogs/TokenAmountInput';
import { Colony } from '~types';

import { StreamingPaymentEndCondition } from '../types';

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
      <Input name="startDate" label="Start date" />
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
          tokenAddressFieldName="limitTokenAddress"
          amountFieldName="limitAmount"
          label="Limit"
        />
      )}
      {endCondition === StreamingPaymentEndCondition.FixedTime && (
        <Input name="endDate" label="End date" />
      )}
    </div>
  );
};

export default StreamingPaymentFormFields;
