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
  avatarFileError: {
    id: `${displayName}.avatarFileError`,
    defaultMessage: 'Accepted file types are: svg, jpg, png and webp',
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
  /** Avatar image string */
  avatar: AvatarProps['avatar'];
  /** Avatar to be wrapped by File uploader */
  avatarPlaceholder: React.ReactElement;
  /** Function to handle the removal of the avatar */
  handleFileRemove?: (...args: any[]) => Promise<any>;
  /** A boolean to represent if there's an error with the file upload */
  hasError?: boolean;
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

const FileError = () => (
  <div className={styles.error}>
    <Icon
      name="file"
      appearance={{ size: 'large' }}
      title={formatText(MSG.avatarFileError)}
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
  hasError: boolean,
  avatarPlaceholder: Props['avatarPlaceholder'],
) => {
  if (hasError) {
    return <FileError />;
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
  disabled,
  elementOnly,
  extra,
  handleFileAccept,
  handleFileReject,
  handleFileRemove,
  hasError = false,
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
        placeholder={getPlaceholder(isLoading, hasError, avatarPlaceholder)}
        ref={dropzoneRef}
        dataTest="avatarUploaderDrop"
      >
        <DropNowOverlay />
      </SingleFileUpload>
      {showButtons && (
        <UploadControls
          handleFileRemove={handleFileRemove}
          disableRemove={!avatar}
          open={open}
        />
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
