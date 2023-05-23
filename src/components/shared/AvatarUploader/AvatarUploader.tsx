import React, { useRef } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  CoreInputProps,
  InputLabel,
  HookFormInputStatus as InputStatus,
  InputComponentAppearance as Appearance,
} from '~shared/Fields';
import { SingleFileUpload, SingleFileUploadProps } from '~shared/FileUpload';
import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';
import { Message } from '~types';

import { DropzoneErrors, getErrorMessage } from './helpers';
import UploadControls from './UploadControls';

import styles from './AvatarUploader.css';

const displayName = 'AvatarUploader';

const MSG = defineMessages({
  dropNow: {
    id: `${displayName}.dropNow`,
    defaultMessage: 'Drop now!',
  },
});

export interface Props
  extends Pick<SingleFileUploadProps, 'handleFileAccept' | 'handleFileReject'>,
    Omit<
      CoreInputProps,
      'name' | 'placeholder' | 'placeholderValues' | 'dataTest'
    > {
  /** Appearance object for both label and status */
  appearance?: Appearance;
  /** Avatar to be wrapped by File uploader */
  avatarPlaceholder: React.ReactElement;
  /** Disable the remove avatar button */
  disableRemove?: boolean;
  /** An error message */
  errorCode?: DropzoneErrors;
  /** An object in the format: { "message": string} for display a custom error message */
  customError?: Record<'message', string>;
  /** Function to handle the removal of the avatar */
  handleFileRemove?: (...args: any[]) => Promise<any>;
  /** If true, will display loading spinner */
  isLoading?: boolean;
  /** Display choose / remove buttons beneath Avatar */
  showButtons?: boolean;
  /** The touched flag can control the visibility of the status / error message (i.e. will be hidden if not touched) */
  touched?: boolean;
}

const DropNowOverlay = () => (
  <div className={styles.dropNowOverlay}>
    <FormattedMessage {...MSG.dropNow} />
  </div>
);

interface FileErrorProps {
  error: Message;
}

const FileError = ({ error }: FileErrorProps) => (
  <div className={styles.error}>
    <Icon
      name="file"
      appearance={{ size: 'large' }}
      title={formatText(error)}
    />
  </div>
);

const LoadingOverlay = () => (
  <div className={styles.loadingOverlay}>
    <div className={styles.loader} />
  </div>
);

const getPlaceholder = (
  isLoading: boolean,
  avatarPlaceholder: Props['avatarPlaceholder'],
  error?: Message,
) => {
  if (error) {
    return <FileError error={error} />;
  }

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return avatarPlaceholder;
};

const AvatarUploader = ({
  appearance,
  avatarPlaceholder,
  disabled = false,
  disableRemove,
  elementOnly,
  extra,
  handleFileAccept,
  handleFileReject,
  handleFileRemove,
  errorCode,
  customError,
  help,
  helpValues,
  isLoading = false,
  label,
  labelValues,
  showButtons = true,
  status,
  statusValues,
  touched,
}: Props) => {
  const dropzoneRef = useRef<{ open: () => void }>();

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
        dropzoneRootStyles={showButtons ? styles : noButtonStyles}
        dropzoneOptions={{
          maxSize: NO_MAX,
          disabled,
        }}
        handleFileAccept={handleFileAccept}
        handleFileReject={handleFileReject}
        placeholder={getPlaceholder(isLoading, avatarPlaceholder, errorCode)}
        ref={dropzoneRef}
        dataTest="avatarUploaderDrop"
      >
        <DropNowOverlay />
      </SingleFileUpload>
      {showButtons && (
        <UploadControls
          handleFileRemove={handleFileRemove}
          disableRemove={disableRemove || disabled}
          disableChoose={disabled}
          open={open}
        />
      )}
      {errorCode && (
        <div className={styles.inputStatus}>
          <InputStatus
            appearance={appearance}
            status={status}
            statusValues={statusValues}
            error={getErrorMessage(errorCode)}
            errorValues={customError}
            touched={touched ?? !!errorCode}
          />
        </div>
      )}
    </>
  );
};

AvatarUploader.displayName = displayName;

export default AvatarUploader;
