import React from 'react';
import { useFormContext } from 'react-hook-form';

import Button from '~shared/Button';
import { DialogProps, DialogSection } from '~shared/Dialog';

import styles from './DecisionControls.css';

const displayName = 'common.ColonyDecisions.DecisionDialog.DecisionControls';

interface DecisionControlsProps {
  cancel: DialogProps['cancel'];
}

const DecisionControls = ({ cancel }: DecisionControlsProps) => {
  const {
    formState: { isSubmitting, defaultValues, isValid, isDirty },
  } = useFormContext();
  // const hasReputation = useColonyReputation(
  //   colonyAddress,
  //   values.motionDomainId,
  // );
  return (
    <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
      <div className={styles.main}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={cancel}
          text={{ id: 'button.cancel' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          type="submit"
          text={{
            id: defaultValues?.title ? 'button.update' : 'button.preview',
          }}
          loading={isSubmitting}
          disabled={
            !isValid || isSubmitting || !isDirty /* || !hasReputation */
          }
        />
      </div>
    </DialogSection>
  );
};

DecisionControls.displayName = displayName;

export default DecisionControls;
