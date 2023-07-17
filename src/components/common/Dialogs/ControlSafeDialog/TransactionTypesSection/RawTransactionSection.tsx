import React, { ReactNode } from 'react';
import { defineMessages } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import { DialogSection } from '~shared/Dialog';
import { HookFormInput as Input } from '~shared/Fields';
import { RecipientPicker } from './shared';
import { TransactionSectionProps } from '../types';

import styles from './TransactionTypesSection.css';

const displayName = `common.ControlSafeDialog.RawTransactionSection`;

const MSG = defineMessages({
  valueLabel: {
    id: `${displayName}.valueLabel`,
    defaultMessage: `Value <span>wei</span>`,
  },
  dataLabel: {
    id: `${displayName}.dataLabel`,
    defaultMessage: `Data <span>bytes</span>`,
  },
});

const labelValues = (chunks: ReactNode) => (
  <span className={styles.labelDescription}>{chunks}</span>
);

const RawTransactionSection = ({
  colony,
  disabledInput,
  transactionFormIndex,
}: TransactionSectionProps) => {
  const { trigger } = useFormContext();

  return (
    <>
      <DialogSection>
        <RecipientPicker
          colony={colony}
          disabledInput={disabledInput}
          transactionFormIndex={0}
        />
      </DialogSection>
      <DialogSection>
        <Input
          label={MSG.valueLabel}
          name={`transactions.${transactionFormIndex}.rawAmount`}
          // onChange={handleInputChange}
          onChange={() => {
            trigger(`transactions.${transactionFormIndex}.rawAmount`);
          }}
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={disabledInput}
          labelValues={{
            span: labelValues,
          }}
          formattingOptions={{
            numeral: true,
            numeralPositiveOnly: true,
            numeralDecimalScale: 0,
          }}
        />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <Input
          label={MSG.dataLabel}
          name={`transactions.${transactionFormIndex}.data`}
          onChange={() => {
            trigger(`transactions.${transactionFormIndex}.data`);
          }}
          // onChange={handleInputChange}
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={disabledInput}
          labelValues={{
            span: labelValues,
          }}
        />
      </DialogSection>
    </>
  );
};

RawTransactionSection.displayName = displayName;

export default RawTransactionSection;
