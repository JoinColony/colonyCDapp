import React from 'react';

import { useFormContext } from 'react-hook-form';
import { MessageDescriptor } from 'react-intl';

import Button from '~shared/Button';

import styles from './DialogControls.css';

const displayName = 'DialogControls';

interface Props {
  disabled: boolean;
  dataTest: string;
  onSecondaryButtonClick: (() => void) | ((val: any) => void) | undefined;
  secondaryButtonText?: MessageDescriptor | string;
}

const DialogControls = ({
  onSecondaryButtonClick,
  disabled,
  dataTest,
  secondaryButtonText = { id: 'button.back' },
}: Props) => {
  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext();
  const forceAction = watch('forceAction');

  return (
    <>
      {onSecondaryButtonClick && (
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={onSecondaryButtonClick}
          text={secondaryButtonText}
        />
      )}
      <Button
        type="submit"
        appearance={{ theme: 'primary', size: 'large' }}
        text={
          forceAction || true // || !isVotingExtensionEnabled
            ? { id: 'button.confirm' }
            : { id: 'button.createMotion' }
        }
        loading={isSubmitting}
        /*
         * Disable Form submissions if either the form is invalid, or
         * if our custom state was triggered.
         */
        disabled={disabled}
        style={{ minWidth: styles.wideButton }}
        data-test={dataTest}
      />
    </>
  );
};

DialogControls.displayName = displayName;

export default DialogControls;
