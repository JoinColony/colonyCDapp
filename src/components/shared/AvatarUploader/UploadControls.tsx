import React from 'react';

import Button from '~shared/Button';

import { Props as AvatarUploaderProps } from './AvatarUploader';

import styles from './AvatarUploader.css';

interface UploadControlsProps extends Pick<AvatarUploaderProps, 'handleFileRemove'> {
  open: () => void;
  disableRemove: boolean;
}

const displayName = 'AvatarUploader.UploadControls';

const UploadControls = ({ handleFileRemove, disableRemove, open }: UploadControlsProps) => (
  <div className={styles.buttonContainer}>
    <Button
      appearance={{ theme: 'danger' }}
      text={{ id: 'button.remove' }}
      onClick={handleFileRemove}
      disabled={disableRemove}
      dataTest="avatarUploaderRemove"
    />
    <Button text={{ id: 'button.choose' }} onClick={open} dataTest="avatarUploaderChoose" />
  </div>
);

UploadControls.displayName = displayName;

export default UploadControls;
