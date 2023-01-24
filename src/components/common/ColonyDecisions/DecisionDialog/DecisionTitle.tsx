import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { DialogSection } from '~shared/Dialog';
import { HookFormInput as Input, InputLabel } from '~shared/Fields';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';

import styles from './DecisionTitle.css';

const displayName = 'common.ColonyDecisions.DecisionDialog.DecisionTitle';

const MAX_TITLE_LENGTH = 50;

const MSG = defineMessages({
  label: {
    id: `${displayName}.label`,
    defaultMessage: 'Title',
  },
  tooltip: {
    id: `${displayName}.tooltip`,
    defaultMessage: `The title will be used on both the Decisions page and Decisions list. It should succinctly define the decision to be made.`,
  },
  titlePlaceholder: {
    id: `${displayName}.titlePlaceholder`,
    defaultMessage: 'Enter a title for your decision...',
  },
});

const DecisionTitle = () => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  // const hasReputation = useColonyReputation(
  //   colonyAddress,
  //   values.motionDomainId,
  // );
  return (
    <DialogSection>
      <div className={styles.main}>
        <div className={styles.label}>
          <InputLabel
            appearance={{ colorSchema: 'grey', theme: 'fat' }}
            label={MSG.label}
          />
          <QuestionMarkTooltip
            tooltipText={MSG.tooltip}
            tooltipClassName={styles.tooltipContainer}
            tooltipPopperOptions={{
              placement: 'top-end',
            }}
          />
        </div>
        <Input
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          name="title"
          disabled={isSubmitting /* || !hasReputation */}
          maxLength={MAX_TITLE_LENGTH}
          placeholder={MSG.titlePlaceholder}
        />
      </div>
    </DialogSection>
  );
};

DecisionTitle.displayName = displayName;

export default DecisionTitle;
