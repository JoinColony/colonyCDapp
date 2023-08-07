import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Input } from '~shared/Fields';
import { Colony } from '~types';

import styles from './ExpenditureForm.module.css';

interface ExpenditureFormFieldsProps {
  colony: Colony;
}

const ExpenditureFormFields = ({ colony }: ExpenditureFormFieldsProps) => {
  const { control } = useFormContext();

  const { fields } = useFieldArray({ name: 'slots', control });

  return (
    <div className={styles.form}>
      {fields.map((field, index) => (
        <React.Fragment key={field.id}>
          <Input
            name={`slots.${index}.recipientAddress`}
            label="Recipient address"
          />
          <Input name={`slots.${index}.tokenAddress`} label="Token address" />
          <div className={styles.amountField}>
            <Input name={`slots.${index}.amount`} label="Amount" />
            <div>{colony.nativeToken.symbol}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ExpenditureFormFields;
