import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import useDropzoneWithFileReader from '~hooks/useDropzoneWithFileReader';
import styles from './AvatarUploader.module.css';
import SuccessContent from './SuccessContent';
import ErrorContent from './ErrorContent';
import DefaultContent from './DefaultContent';
import { FileUploadProps } from '../types';
import { useMobile } from '~hooks';

const displayName = 'v5.common.AvatarUploader.partials.partials.FileUpload';

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
  const isMobile = useMobile();

  const { getInputProps, getRootProps, open, isDragReject, fileRejections } =
    useDropzoneWithFileReader({
      dropzoneOptions: {
        maxFiles: 1,
        ...dropzoneOptions,
      },
      handleFileAccept,
      handleFileReject,
    });

  const avatar = <div className="w-16 mr-4">{placeholder}</div>;
  const uploaderInfo = (
    <div className={styles.text}>
      {formatMessage({ id: 'avatar.uploader.info' })}
    </div>
  );
  const successContent = (
    <SuccessContent open={open} handleFileRemove={handleFileRemove} />
  );
  const defaultContent = <DefaultContent open={open} />;
  const errorContent = (
    <ErrorContent
      errorCode={errorCode}
      handleFileRemove={handleFileRemove}
      open={open}
      getInputProps={getInputProps}
      fileRejections={fileRejections?.[0]?.file?.name}
    />
  );

  return (
    <div className="flex gap-2">
      {isMobile ? (
        <div className={styles.flexCol}>
          <div className="flex items-center">
            {avatar}
            <div className={styles.flexCol}>
              {uploaderInfo}
              {isAvatarUploaded && !errorCode && successContent}
            </div>
          </div>
          {!!errorCode && errorContent}
          {!isAvatarUploaded && !errorCode && defaultContent}
        </div>
      ) : (
        <>
          {avatar}
          <div className={`${styles.flexCol} w-full`}>
            {uploaderInfo}
            <div
              className={clsx(styles.wrapper)}
              {...getRootProps({ 'aria-invalid': isDragReject })}
            >
              <input {...getInputProps()} />
              {!!errorCode && errorContent}
              {isAvatarUploaded && !errorCode && successContent}
              {!isAvatarUploaded && !errorCode && defaultContent}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

FileUpload.displayName = displayName;

export default FileUpload;
