import React, { ReactNode } from 'react';
import { defineMessages } from 'react-intl';

import { DialogSection } from '~shared/Dialog';
import { Input } from '~shared/Fields';

import { TransactionSectionProps } from '../types';

import { RecipientPicker } from './shared';

import styles from './TransactionTypesSection.css';

const displayName = `common.ControlSafeDialog.ControlSafeDialogForm.RawTransactionSection`;

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
  transactionIndex,
}: TransactionSectionProps) => (
  <>
    <DialogSection>
      <RecipientPicker
        colony={colony}
        disabledInput={disabledInput}
        transactionIndex={transactionIndex}
      />
    </DialogSection>
    <DialogSection>
      <Input
        label={MSG.valueLabel}
        name={`transactions.${transactionIndex}.rawAmount`}
        appearance={{ colorSchema: 'grey', theme: 'fat' }}
        disabled={disabledInput}
        labelValues={{
          span: labelValues,
        }}
      />
    </DialogSection>
    <DialogSection appearance={{ theme: 'sidePadding' }}>
      <Input
        label={MSG.dataLabel}
        name={`transactions.${transactionIndex}.data`}
        appearance={{ colorSchema: 'grey', theme: 'fat' }}
        disabled={disabledInput}
        labelValues={{
          span: labelValues,
        }}
      />
    </DialogSection>
  </>
);

RawTransactionSection.displayName = displayName;

export default RawTransactionSection;
