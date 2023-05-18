import React, { useRef } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  CoreInputProps,
  InputLabel,
  InputStatus,
  InputComponentAppearance as Appearance,
} from '~shared/Fields';
import { SingleFileUpload, SingleFileUploadProps } from '~shared/FileUpload';
import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';
import { AvatarProps } from '~shared/Avatar';
import { NO_MAX } from '~shared/FileUpload/limits';

import UploadControls from './UploadControls';

import styles from './AvatarUploader.css';

const displayName = 'AvatarUploader';

const MSG = defineMessages({
  dropNow: {
    id: `${displayName}.dropNow`,
    defaultMessage: 'Drop now!',
  },
  fileCompressionError: {
    id: `${displayName}.fileCompressionError`,
    defaultMessage:
      'File could not be uploaded and may be corrupted. Try again with a different file.',
  },
  fileSizeError: {
    id: `${displayName}.fileSizeError`,
    defaultMessage: 'File is too large. Try again with a smaller image',
  },
  fileTypeError: {
    id: `${displayName}.fileTypeError`,
    defaultMessage:
      'Unsupported file type. Accepted file types are: svg, jpg, png and webp',
  },
});

const getErrorMessage = (errorMessage: string) => {
  if (errorMessage.includes('file-invalid-type')) {
    return MSG.fileTypeError;
  }

  if (errorMessage.includes('exceeded the maximum')) {
    return MSG.fileSizeError;
  }

  return MSG.fileCompressionError;
};

export interface Props
  extends Pick<SingleFileUploadProps, 'handleFileAccept' | 'handleFileReject'>,
    Omit<
      CoreInputProps,
      'name' | 'placeholder' | 'placeholderValues' | 'dataTest'
    > {
  /** Appearance object for both label and status */
  appearance?: Appearance;
  /** Avatar image string */
  avatar: AvatarProps['avatar'];
  /** Avatar to be wrapped by File uploader */
  avatarPlaceholder: React.ReactElement;
  /** An error message */
  error?: string;
  /** Function to handle the removal of the avatar */
  handleFileRemove?: (...args: any[]) => Promise<any>;
  /** If true, will display loading spinner */
  isLoading?: boolean;
  /** Display choose / remove buttons beneath Avatar */
  showButtons?: boolean;
}

const DropNowOverlay = () => (
  <div className={styles.dropNowOverlay}>
    <FormattedMessage {...MSG.dropNow} />
  </div>
);

interface FileErrorProps {
  error: string;
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
  error?: string,
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
  avatar,
  avatarPlaceholder,
  disabled = false,
  elementOnly,
  extra,
  handleFileAccept,
  handleFileReject,
  handleFileRemove,
  error,
  help,
  helpValues,
  isLoading = false,
  label,
  labelValues,
  showButtons = true,
  status,
  statusValues,
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
        placeholder={getPlaceholder(isLoading, avatarPlaceholder, error)}
        ref={dropzoneRef}
        dataTest="avatarUploaderDrop"
      >
        <DropNowOverlay />
      </SingleFileUpload>
      {showButtons && (
        <UploadControls
          handleFileRemove={handleFileRemove}
          disableRemove={!avatar || disabled}
          disableChoose={disabled}
          open={open}
        />
      )}
      {error && (
        <div className={styles.inputStatus}>
          <InputStatus
            appearance={appearance}
            status={status}
            statusValues={statusValues}
            error={getErrorMessage(error)}
          />
        </div>
      )}
    </>
  );
};

AvatarUploader.displayName = displayName;

export default AvatarUploader;
