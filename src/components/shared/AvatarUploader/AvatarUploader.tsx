import React, { useRef } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ApolloError, FetchResult } from '@apollo/client';

import { HookForm as Form, InputStatus } from '~shared/Fields';
import FileUpload, { FileReaderFile } from '~shared/FileUpload';
import { FileUploadProps } from '~shared/FileUpload/types';

import Button from '../Button';
import AvatarUploadItem from './AvatarUploadItem';

import styles from './AvatarUploader.css';

const displayName = 'AvatarUploader';

const MSG = defineMessages({
  dropNow: {
    id: `${displayName}.dropNow`,
    defaultMessage: 'Drop now!',
  },
  notAllowed: {
    id: `${displayName}.notAllowed`,
    defaultMessage: 'Not allowed',
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

const ACCEPTED_MAX_FILE_SIZE = 1048576; // 1 Mb

interface Props extends Partial<FileUploadProps> {
  /** Used to control the state of the remove button (don't fire the remove action if not avatar is set) */
  isSet?: boolean;
  /** Function to handle an upload error from the outside */
  handleError?: (...args: any[]) => Promise<any>;
  /** Display choose / remove buttons beneath Avatar */
  hasButtons: boolean;
  /** Function to handle removal of the avatar (should set avatarURL to null from outside) */
  remove: (...args: any[]) => Promise<any>;
  /** Function to handle the actual uploading of the file */
  upload: (fileData: FileReaderFile) => Promise<FetchResult>;
  /** Present if there was an error calling the mutation */
  uploadError?: ApolloError;
}

const AvatarUploader = ({
  appearance,
  remove,
  hasButtons,
  disabled,
  isSet = true,
  uploadError,
  ...uploaderProps
}: Props) => {
  const dropzoneRef = useRef<{ open: () => void }>();

  const open = () => {
    // will be null if disabled
    if (typeof dropzoneRef.current?.open === 'function') {
      dropzoneRef.current.open();
    }
  };

  // FileUpload children are renderProps (functions)
  const renderOverlay = () => (
    <div className={styles.overlay}>
      <FormattedMessage {...MSG.dropNow} />
    </div>
  );

  const noButtonStyles = {
    ...styles,
    dropzone: styles.dropzoneNoButtonsVariant,
  };

  // Form is used for state and error handling through FileUpload, nothing else
  return (
    <Form onSubmit={() => {}} defaultValues={{ avatarUploader: [] }}>
      {({ formState: { errors }, reset }) => {
        const name = 'avatarUploader';
        const error = errors[name];
        const hasError = !!uploadError || !!error;
        const choose = () => {
          reset();
          // waits for form state to reset, which clears 'disabled'-ness in the event previous upload errored
          setTimeout(open, 0);
        };

        return (
          <>
            <FileUpload
              {...uploaderProps}
              classNames={hasButtons ? styles : noButtonStyles}
              dropzoneOptions={{
                accept: ACCEPTED_MIME_TYPES,
                maxSize: ACCEPTED_MAX_FILE_SIZE,
                disabled,
              }}
              appearance={appearance}
              maxFilesLimit={1}
              name={name}
              ref={dropzoneRef}
              itemComponent={AvatarUploadItem}
              dataTest="avatarUploaderDrop"
            >
              {renderOverlay()}
            </FileUpload>
            {hasButtons && (
              <div className={styles.buttonContainer}>
                <Button
                  appearance={{ theme: 'danger' }}
                  text={{ id: 'button.remove' }}
                  onClick={remove}
                  disabled={!isSet}
                  dataTest="avatarUploaderRemove"
                />
                <Button
                  text={{ id: 'button.choose' }}
                  onClick={choose}
                  dataTest="avatarUploaderChoose"
                />
              </div>
            )}
            {hasError && (
              <div className={styles.inputStatus}>
                <InputStatus
                  appearance={appearance}
                  error={MSG.avatarFileError}
                />
              </div>
            )}
          </>
        );
      }}
    </Form>
  );
};

AvatarUploader.displayName = displayName;
export default AvatarUploader;
