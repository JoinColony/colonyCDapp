import React, { FC, PropsWithChildren } from 'react';

import useDropzoneWithFileReader from '~hooks/useDropzoneWithFileReader';
import SuccessContent from './SuccessContent';
import ErrorContent from './ErrorContent';
import DefaultContent from './DefaultContent';
import { FileUploadProps } from '../types';

const displayName = 'v5.common.AvatarUploader.partials.partials.FileUpload';

const FileUpload: FC<PropsWithChildren<FileUploadProps>> = ({
  dropzoneOptions,
  handleFileAccept,
  handleFileReject,
  handleFileRemove,
  errorCode,
  isAvatarUploaded,
  isPropgressContentVisible,
  isSimplified,
  fileOptions,
  fileUploadErrorMessages,
  children,
}) => {
  const { getInputProps, getRootProps, open, isDragReject, fileRejections } =
    useDropzoneWithFileReader({
      dropzoneOptions: {
        maxFiles: 1,
        ...dropzoneOptions,
      },
      handleFileAccept,
      handleFileReject,
    });

  const successContent = (
    <SuccessContent open={open} handleFileRemove={handleFileRemove} />
  );
  const defaultContent = (
    <DefaultContent
      isSimplified={isSimplified}
      open={open}
      fileOptions={fileOptions}
    />
  );
  const errorContent = (
    <ErrorContent
      errorCode={errorCode}
      handleFileRemove={handleFileRemove}
      open={open}
      getInputProps={getInputProps}
      fileRejections={fileRejections?.[0]?.file?.name}
      fileOptions={fileOptions}
      fileUploadErrorMessages={fileUploadErrorMessages}
    />
  );

  const shouldShowDefaultContent =
    !isAvatarUploaded && !errorCode && !isPropgressContentVisible;
  const shouldShowSuccessContent =
    isAvatarUploaded && !errorCode && !isPropgressContentVisible;

  return (
    <div className="w-full">
      <div
        className="flex md:flex-col w-full"
        {...getRootProps({ 'aria-invalid': isDragReject })}
      >
        <input {...getInputProps()} />
        {!!errorCode && errorContent}
        {shouldShowSuccessContent && successContent}
        {shouldShowDefaultContent && (
          <>
            {children}
            {defaultContent}
          </>
        )}
      </div>
    </div>
  );
};

FileUpload.displayName = displayName;

export default FileUpload;
