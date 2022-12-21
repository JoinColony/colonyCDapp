import React, { useRef, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ApolloError } from '@apollo/client';

import {
  CoreInputProps,
  InputLabel,
  InputStatus,
  InputComponentAppearance as Appearance,
} from '~shared/Fields';
import { SingleFileUpload, SingleFileUploadProps } from '~shared/FileUpload';
import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';

import Button from '../Button';

import styles from './AvatarUploader.css';

const displayName = 'AvatarUploader';

const MSG = defineMessages({
  dropNow: {
    id: `${displayName}.dropNow`,
    defaultMessage: 'Drop now!',
  },
  avatarFileError: {
    id: `${displayName}.avatarFileError`,
    defaultMessage: 'This filetype is not allowed or file is too big',
  },
});

const ACCEPTED_MIME_TYPES = {
  'image/svg+xml': [],
  'image/png': [],
};

interface Props
  extends Pick<SingleFileUploadProps, 'handleFileAccept'>,
    Omit<
      CoreInputProps,
      'name' | 'placeholder' | 'placeholderValues' | 'dataTest'
    > {
  /** Appearance object for both label and status */
  appearance?: Appearance;
  /** Avatar to be wrapped by File uploader */
  avatar: React.ReactElement;
  /** Used to control the state of the remove button (don't fire the remove action if not avatar is set) */
  isSet?: boolean;
  /** Display choose / remove buttons beneath Avatar */
  hasButtons?: boolean;
  /** Function to handle removal of the avatar (should set avatarURL to null from outside) */
  handleFileRemove: (...args: any[]) => Promise<any>;
  /** Present if there was an error calling the mutation */
  uploadError?: ApolloError;
}

const DropNowOverlay = () => (
  <div className={styles.dropNowOverlay}>
    <FormattedMessage {...MSG.dropNow} />
  </div>
);

const FileError = () => (
  <div className={styles.error}>
    <Icon
      name="file"
      appearance={{ size: 'large' }}
      title={formatText(MSG.avatarFileError)}
    />
  </div>
);

const AvatarUploader = ({
  appearance,
  avatar,
  disabled,
  elementOnly,
  extra,
  handleFileAccept,
  handleFileRemove,
  hasButtons = true,
  help,
  helpValues,
  isSet = true,
  label,
  labelValues,
  status,
  statusValues,
  uploadError,
}: Props) => {
  const dropzoneRef = useRef<{ open: () => void }>();
  const [error, setError] = useState<boolean>(false);
  const open = () => {
    // will be null if dropzone is disabled
    if (typeof dropzoneRef.current?.open === 'function') {
      dropzoneRef.current.open();
    }
  };

  const noButtonStyles = {
    ...styles,
    dropzone: styles.dropzoneNoButtonsVariant,
  };

  const hasError = !!uploadError || !!error;

  return (
    <>
      {!elementOnly && label && (
        <InputLabel
          appearance={appearance}
          label={label}
          labelValues={labelValues}
          help={help}
          helpValues={helpValues}
          extra={extra}
        />
      )}
      <SingleFileUpload
        dropzoneRootStyles={hasButtons ? styles : noButtonStyles}
        dropzoneOptions={{
          accept: ACCEPTED_MIME_TYPES,
          disabled,
        }}
        handleFileAccept={handleFileAccept}
        handleFileReject={() => {
          setError(true);
        }}
        placeholder={hasError ? <FileError /> : avatar}
        ref={dropzoneRef}
        dataTest="avatarUploaderDrop"
      >
        <DropNowOverlay />
      </SingleFileUpload>
      {hasButtons && (
        <div className={styles.buttonContainer}>
          <Button
            appearance={{ theme: 'danger' }}
            text={{ id: 'button.remove' }}
            onClick={handleFileRemove}
            disabled={!isSet}
            dataTest="avatarUploaderRemove"
          />
          <Button
            text={{ id: 'button.choose' }}
            onClick={() => {
              setError(false);
              open();
            }}
            dataTest="avatarUploaderChoose"
          />
        </div>
      )}
      {hasError && (
        <div className={styles.inputStatus}>
          <InputStatus
            appearance={appearance}
            status={status}
            statusValues={statusValues}
            error={MSG.avatarFileError}
          />
        </div>
      )}
    </>
  );
};

AvatarUploader.displayName = displayName;
export default AvatarUploader;
