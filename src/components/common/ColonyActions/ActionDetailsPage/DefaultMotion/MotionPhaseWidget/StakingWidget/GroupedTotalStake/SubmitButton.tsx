import React from 'react';
import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~hooks';
import Button from '~shared/Button';

import styles from './SubmitButton.css';

const displayName =
  'common.ColonyActions.ActionDetailsPAge.DefaultMotion.StakingWidget.GroupedTotalStake.SubmitButton';

const SubmitButton = () => {
  const { user } = useAppContext();
  const {
    formState: { isValid, isDirty },
  } = useFormContext();

  return (
    <div className={styles.submitButtonContainer}>
      <Button
        type="submit"
        appearance={{ theme: 'primary', size: 'medium' }}
        text={{ id: 'button.next' }}
        disabled={!isValid || !user || !isDirty}
      />
    </div>
  );
};

SubmitButton.displayName = displayName;

export default SubmitButton;
