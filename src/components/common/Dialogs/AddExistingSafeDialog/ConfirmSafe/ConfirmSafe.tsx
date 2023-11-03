import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { useFormContext } from 'react-hook-form';

import Button from '~shared/Button';
import { DialogSection } from '~shared/Dialog';
import { Input, Annotations, InputLabel } from '~shared/Fields';
import MaskedAddress from '~shared/MaskedAddress';
import Avatar from '~shared/Avatar';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';
import { SAFE_NAMES_MAP } from '~constants';

import { AddExistingSafeProps } from '../types';

import defaultStyles from '../AddExistingSafeDialogForm.css';
import styles from './ConfirmSafe.css';

const displayName =
  'common.AddExistingSafeDialog.AddExistingSafeDialogForm.ConfirmSafe';

const MSG = defineMessages({
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Step 3: Add Safe',
  },
  instructions: {
    id: `${displayName}.instructions`,
    defaultMessage: `Confirm the details of the Safe, and give the Safe a name in Colony.`,
  },
  chain: {
    id: `${displayName}.chain`,
    defaultMessage: 'Chain',
  },
  safe: {
    id: `${displayName}.safe`,
    defaultMessage: 'Safe',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: "Explain why you're adding the Safe (optional)",
  },
  safeName: {
    id: `${displayName}.safeName`,
    defaultMessage: 'Name the Safe',
  },
  safeNameTooltip: {
    id: `${displayName}.safeNameTooltip`,
    defaultMessage:
      'Give the Safe a name so it can easily be identified on Colony.',
  },
  addSafe: {
    id: `${displayName}.addSafe`,
    defaultMessage: 'Add Safe',
  },
});

type Props = Pick<AddExistingSafeProps, 'setStepIndex'>;

interface SummaryRowProps {
  label: MessageDescriptor;
  item: JSX.Element;
}

const SummaryRow = ({ label, item }: SummaryRowProps) => (
  <div className={styles.summaryRow}>
    <FormattedMessage {...label} />
    {item}
  </div>
);

const ConfirmSafe = ({ setStepIndex }: Props) => {
  const {
    formState: { isSubmitting, isValid },
    watch,
  } = useFormContext();
  const { contractAddress, chainId } = watch();

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <span className={defaultStyles.subtitle}>
          <FormattedMessage {...MSG.subtitle} />
        </span>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div
          className={`${defaultStyles.instructions} ${styles.step3Instructions}`}
        >
          <FormattedMessage {...MSG.instructions} />
        </div>
      </DialogSection>
      <DialogSection>
        <SummaryRow
          label={MSG.chain}
          item={
            <span className={styles.chainName}>
              {SAFE_NAMES_MAP[Number(chainId)]}
            </span>
          }
        />
        <SummaryRow
          label={MSG.safe}
          item={
            <div className={styles.safe}>
              <Avatar
                seed={contractAddress}
                placeholderIcon="at-sign-circle"
                title="Safe"
                size="xs"
              />
              <MaskedAddress address={contractAddress} />
            </div>
          }
        />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.safeNameContainer}>
          <InputLabel
            appearance={{ colorSchema: 'grey', theme: 'fat' }}
            label={MSG.safeName}
          />
          <QuestionMarkTooltip
            tooltipClassName={defaultStyles.tooltip}
            tooltipText={MSG.safeNameTooltip}
            tooltipPopperOptions={{
              placement: 'top',
            }}
          />
        </div>
        <Input
          name="safeName"
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={isSubmitting}
          // @NOTE: There is no limit on Safe names, so, we can impose our own
          maxLength={20}
        />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={isSubmitting}
          dataTest="addSafeAnnotation"
        />
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={() => setStepIndex((step) => step - 1)}
          disabled={isSubmitting}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={MSG.addSafe}
          type="submit"
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
          style={{ width: defaultStyles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

ConfirmSafe.displayName = displayName;

export default ConfirmSafe;
