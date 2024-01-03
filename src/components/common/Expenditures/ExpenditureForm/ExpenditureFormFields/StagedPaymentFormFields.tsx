import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { IconButton } from '~shared/Button';
import { Input } from '~shared/Fields';
import { Heading4 } from '~shared/Heading';
import { Colony } from '~types';

import { getInitialStageFieldValue } from '../helpers';

import styles from '../ExpenditureForm.module.css';

interface StagedPaymentFormFieldsProps {
  colony: Colony;
}

const StagedPaymentFormFields = ({ colony }: StagedPaymentFormFieldsProps) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: 'stages',
    control,
  });

  return (
    <div>
      <div>
        <Input name="recipientAddress" label="Recipient address" />
      </div>
      <div>
        <Heading4 appearance={{ weight: 'bold' }}>Stages</Heading4>
        {fields.map((field, index) => (
          <div className={styles.field} key={field.id}>
            <IconButton
              onClick={() => remove(index)}
              text=""
              icon="trash"
              disabled={fields.length <= 1}
            />
            <Input name={`stages.${index}.name`} label="Milestone" />
            <Input
              name={`stages.${index}.tokenAddress`}
              label="Token address"
            />
            <div className={styles.amountField}>
              <Input name={`stages.${index}.amount`} label="Amount" />
              <div>{colony.nativeToken.symbol}</div>
            </div>
          </div>
        ))}

        <IconButton
          onClick={() =>
            append(getInitialStageFieldValue(colony.nativeToken.tokenAddress))
          }
          text=""
          icon="circle-plus"
        />
      </div>
    </div>
  );
};

export default StagedPaymentFormFields;
