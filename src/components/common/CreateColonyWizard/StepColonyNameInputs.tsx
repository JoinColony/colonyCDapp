import React from 'react';
import { defineMessages } from 'react-intl';

import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';
import { HookFormInput as Input } from '~shared/Fields';
import { DEFAULT_NETWORK_INFO } from '~constants';

import styles from './StepColonyName.css';

const displayName = 'common.CreateColonyWizard.StepColonyNameInputs';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: `Welcome @{username}, let's begin creating your colony.`,
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage: `What would you like to name your colony? Note, it is not possible to change it later.`,
  },
  colonyUniqueURL: {
    id: `${displayName}.colonyUniqueURL`,
    defaultMessage: 'Colony Unique URL',
  },
  colonyName: {
    id: `${displayName}.colonyName`,
    defaultMessage: 'Colony Name',
  },
  tooltip: {
    id: `${displayName}.tooltip`,
    defaultMessage: `You can use this to create a custom URL and invite people to join your colony.`,
  },
});

const formatting = {
  colonyName: { lowercase: true, blocks: [255] },
};

interface StepColonyNameInputsProps {
  disabled: boolean;
  isMobile: boolean;
  cleaveDefaultValue: string;
}

const StepColonyNameInputs = ({ disabled, isMobile, cleaveDefaultValue }: StepColonyNameInputsProps) => (
  <>
    <Input
      appearance={{ theme: 'fat' }}
      name="displayName"
      data-test="claimColonyDisplayNameInput"
      label={MSG.colonyName}
      disabled={disabled}
    />
    <Input
      appearance={{ theme: 'fat' }}
      name="colonyName"
      data-test="claimColonyNameInput"
      label={MSG.colonyUniqueURL}
      formattingOptions={formatting.colonyName}
      value={cleaveDefaultValue}
      disabled={disabled}
      extra={
        <QuestionMarkTooltip
          tooltipText={MSG.tooltip}
          tooltipTextValues={{
            displayENSDomain: DEFAULT_NETWORK_INFO.displayENSDomain,
          }}
          className={styles.iconContainer}
          tooltipClassName={styles.tooltipContent}
          tooltipPopperOptions={
            isMobile
              ? {
                  placement: 'left',
                }
              : undefined
          }
        />
      }
    />
  </>
);

StepColonyNameInputs.displayName = displayName;

export default StepColonyNameInputs;
