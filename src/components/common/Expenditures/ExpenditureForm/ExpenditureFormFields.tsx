import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Input } from '~shared/Fields';
import { Colony } from '~types';
import Button, { IconButton } from '~shared/Button';

import styles from './ExpenditureForm.module.css';
import { getInitialSlotFieldValue } from './helpers';

interface ExpenditureFormFieldsProps {
  colony: Colony;
}

const ExpenditureFormFields = ({ colony }: ExpenditureFormFieldsProps) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({ name: 'slots', control });

  return (
    <>
      {fields.map((field, index) => (
        <div className={styles.field} key={field.id}>
          <IconButton
            onClick={() => remove(index)}
            text=""
            icon="trash"
            disabled={fields.length <= 1}
          />
          <Input
            name={`slots.${index}.recipientAddress`}
            label="Recipient address"
          />
          <Input name={`slots.${index}.tokenAddress`} label="Token address" />
          <div className={styles.amountField}>
            <Input name={`slots.${index}.amount`} label="Amount" />
            <div>{colony.nativeToken.symbol}</div>
          </div>
        </div>
      ))}
      <Button
        onClick={() =>
          append(getInitialSlotFieldValue(colony.nativeToken.tokenAddress))
        }
        appearance={{ size: 'small' }}
      >
        New recipient
      </Button>
    </>
  );
};

export default ExpenditureFormFields;
