import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import useDropzoneWithFileReader from '~hooks/useDropzoneWithFileReader';
import styles from './AvatarUploader.module.css';
import SuccessContent from './SuccessContent';
import ErrorContent from './ErrorContent';
import DefaultContent from './DefaultContent';
import { FileUploadProps } from '../types';

const displayName = 'v5.pages.UserProfilePage.partials.FileUpload';

const FileUpload: FC<FileUploadProps> = ({
  dropzoneOptions,
  placeholder,
  handleFileAccept,
  handleFileReject,
  handleFileRemove,
  errorCode,
  isAvatarUploaded,
}) => {
  const { formatMessage } = useIntl();

  const { getInputProps, getRootProps, open, isDragReject, fileRejections } =
    useDropzoneWithFileReader({
      dropzoneOptions: {
        maxFiles: 1,
        ...dropzoneOptions,
      },
      handleFileAccept,
      handleFileReject,
    });

  return (
    <div className="flex gap-2">
      <div className="w-16">{placeholder}</div>
      <div>
        <span className={styles.text}>
          {formatMessage({ id: 'avatar.uploader.info' })}
        </span>
        <div
          className={clsx(styles.wrapper)}
          {...getRootProps({ 'aria-invalid': isDragReject })}
        >
          {!!errorCode && (
            <ErrorContent
              errorCode={errorCode}
              handleFileRemove={handleFileRemove}
              open={open}
              getInputProps={getInputProps}
              fileRejections={fileRejections?.[0]?.file?.name}
            />
          )}
          {isAvatarUploaded && (
            <SuccessContent open={open} handleFileRemove={handleFileRemove} />
          )}
          {!isAvatarUploaded && !errorCode && (
            <DefaultContent>
              <input {...getInputProps()} />
            </DefaultContent>
          )}
        </div>
      </div>
    </div>
  );
};

FileUpload.displayName = displayName;

export default FileUpload;
