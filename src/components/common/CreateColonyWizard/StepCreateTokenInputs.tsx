import React from 'react';
import { defineMessages } from 'react-intl';

import { HookFormInput as Input } from '~shared/Fields';

import styles from './StepCreateToken.css';

const displayName = 'common.CreateColonyWizard.StepCreateTokenInputs';

const MSG = defineMessages({
  labelTokenName: {
    id: `${displayName}.labelTokenName`,
    defaultMessage: 'Token Name',
  },
  labelTokenSymbol: {
    id: `${displayName}.labelTokenSymbol`,
    defaultMessage: 'Token Symbol',
  },
  helpTokenSymbol: {
    id: `${displayName}.helpTokenSymbol`,
    defaultMessage: '(e.g., MAT, AMEX)',
  },
  helpTokenName: {
    id: `${displayName}.helpTokenName`,
    defaultMessage: '(e.g., My Awesome Token)',
  },
  link: {
    id: `${displayName}.link`,
    defaultMessage: 'I want to use an existing token',
  },
});

const formatting = {
  tokenSymbol: { uppercase: true, blocks: [5] },
};

interface StepCreateTokenInputsProps {
  disabled: boolean;
  extra: JSX.Element;
  cleaveDefaultValue: string;
}

const StepCreateTokenInputs = ({ disabled, extra, cleaveDefaultValue }: StepCreateTokenInputsProps) => (
  <div className={styles.inputFields}>
    <div className={styles.inputFieldWrapper}>
      <Input
        name="tokenName"
        appearance={{ theme: 'fat' }}
        label={MSG.labelTokenName}
        help={MSG.helpTokenName}
        data-test="defineTokenName"
        disabled={disabled}
        extra={extra}
      />
    </div>
    <div className={styles.inputFieldWrapper}>
      <Input
        name="tokenSymbol"
        value={cleaveDefaultValue}
        appearance={{ theme: 'fat' }}
        maxLength={5}
        data-test="defineTokenSymbol"
        formattingOptions={formatting.tokenSymbol}
        label={MSG.labelTokenSymbol}
        help={MSG.helpTokenSymbol}
        disabled={disabled}
      />
    </div>
  </div>
);

StepCreateTokenInputs.displayName = displayName;
export default StepCreateTokenInputs;
