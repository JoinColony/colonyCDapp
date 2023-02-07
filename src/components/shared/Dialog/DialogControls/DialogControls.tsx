import React from 'react';

import { useFormContext } from 'react-hook-form';

import Button from '~shared/Button';

import styles from './DialogControls.css';

const displayName = 'DialogControls';

interface Props {
  disabled: boolean;
  dataTest: string;
  back?: () => void;
}

const DialogControls = ({ back, disabled, dataTest }: Props) => {
  const {
    getValues,
    formState: { isSubmitting },
  } = useFormContext();
  const values = getValues();

  return (
    <>
      <Button
        appearance={{ theme: 'secondary', size: 'large' }}
        onClick={back}
        text={{ id: 'button.back' }}
      />
      <Button
        appearance={{ theme: 'primary', size: 'large' }}
        text={
          values.forceAction || true // || !isVotingExtensionEnabled
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
