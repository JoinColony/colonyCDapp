import React, { type FC, useState } from 'react';

import useDropzoneWithFileReader from '~hooks/useDropzoneWithFileReader.ts';

import { type FileUploadProps } from '../types.ts';

import DefaultContent from './DefaultContent.tsx';
import ErrorContent from './ErrorContent.tsx';

const displayName = 'v5.common.AvatarUploader.partials.partials.FileUpload';

const FileUpload: FC<FileUploadProps> = ({
  dropzoneOptions,
  handleFileAccept,
  handleFileReject,
  handleFileRemove,
  errorCode,
  isAvatarUploaded,
  isProgressContentVisible,
  isSimplified,
  fileOptions,
  SuccessComponent,
  showUploader,
  setShowUploader,
  isAvatarAvailable,
}) => {
  const [showDefault, setShowDefault] = useState(false);
  const {
    getInputProps,
    getRootProps,
    open,
    isDragReject,
    fileRejections,
    isDragAccept,
  } = useDropzoneWithFileReader({
    dropzoneOptions: {
      maxFiles: 1,
      ...dropzoneOptions,
    },
    handleFileAccept: (event) => {
      setShowDefault(false);
      handleFileAccept(event);
    },
    handleFileReject,
  });

  const shouldShowDefaultContent =
    (showDefault && !errorCode) ||
    (!isAvatarUploaded && !errorCode && !isProgressContentVisible);

  const shouldShowSuccessContent = !shouldShowDefaultContent && !errorCode;

  const defaultContent = (
    <DefaultContent
      isSimplified={isSimplified}
      open={open}
      fileOptions={fileOptions}
      isDragAccept={isDragAccept}
      handleFileRemove={handleFileRemove}
      showUploader={showUploader}
      setShowUploader={setShowUploader}
      showRemoveAvatarButton={isAvatarAvailable}
    />
  );

  const successContent = SuccessComponent ? (
    <SuccessComponent
      open={() => setShowDefault(true)}
      handleFileRemove={handleFileRemove}
    />
  ) : (
    defaultContent
  );

  const errorContent = (
    <ErrorContent
      errorCode={errorCode}
      handleFileRemove={handleFileRemove}
      open={open}
      fileRejections={fileRejections?.[0]?.file?.name}
    />
  );

  return (
    <div className="w-full">
      <div
        className="flex w-full text-center md:flex-col"
        {...getRootProps({ 'aria-invalid': isDragReject })}
      >
        <input {...getInputProps()} />
        {!!errorCode && errorContent}
        {shouldShowSuccessContent && successContent}
        {shouldShowDefaultContent && defaultContent}
      </div>
    </div>
  );
};

FileUpload.displayName = displayName;

export default FileUpload;
