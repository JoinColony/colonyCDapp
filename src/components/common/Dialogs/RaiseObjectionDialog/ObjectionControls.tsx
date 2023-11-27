import React from 'react';

import Button from '~shared/Button';
import { DialogProps, DialogSection } from '~shared/Dialog';

import styles from './ObjectionControls.css';

const displayName = 'common.Dialogs.RaiseObjectionDialog.ObjectionControls';

interface ObjectionControlsProps {
  cancel: DialogProps['cancel'];
  disabled: boolean;
}

const ObjectionControls = ({ cancel, disabled }: ObjectionControlsProps) => (
  <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
    <Button
      appearance={{ theme: 'secondary', size: 'large' }}
      text={{ id: 'button.cancel' }}
      onClick={cancel}
    />
    <span className={styles.submitButton}>
      <Button
        appearance={{ theme: 'pink', size: 'large' }}
        text={{ id: 'button.stake' }}
        type="submit"
        disabled={disabled}
        dataTest="objectDialogStakeButton"
      />
    </span>
  </DialogSection>
);

ObjectionControls.displayName = displayName;

export default ObjectionControls;
