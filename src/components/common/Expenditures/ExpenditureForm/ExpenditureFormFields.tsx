import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Input } from '~shared/Fields';
import { Colony } from '~types';
import { IconButton } from '~shared/Button';

import { getInitialPayoutFieldValue } from './helpers';

import styles from './ExpenditureForm.module.css';

interface ExpenditureFormFieldsProps {
  colony: Colony;
}

const ExpenditureFormFields = ({ colony }: ExpenditureFormFieldsProps) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: 'payouts',
    control,
  });

  return (
    <div>
      {fields.map((field, index) => (
        <div className={styles.field} key={field.id}>
          <IconButton
            onClick={() => remove(index)}
            text=""
            icon="trash"
            disabled={fields.length <= 1}
          />
          <Input
            name={`payouts.${index}.recipientAddress`}
            label="Recipient address"
          />
          <Input name={`payouts.${index}.tokenAddress`} label="Token address" />
          <div className={styles.amountField}>
            <Input name={`payouts.${index}.amount`} label="Amount" />
            <div>{colony.nativeToken.symbol}</div>
          </div>
          <Input name={`payouts.${index}.claimDelay`} label="Claim delay" />
        </div>
      ))}

      <IconButton
        onClick={() =>
          append(getInitialPayoutFieldValue(colony.nativeToken.tokenAddress))
        }
        text=""
        icon="circle-plus"
      >
        Add recipient
      </IconButton>
    </div>
  );
};

export default ExpenditureFormFields;
