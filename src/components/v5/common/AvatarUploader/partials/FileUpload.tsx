import React, { FC, useState } from 'react';

import useDropzoneWithFileReader from '~hooks/useDropzoneWithFileReader';
import SuccessContent from './SuccessContent';
import ErrorContent from './ErrorContent';
import DefaultContent from './DefaultContent';
import { FileUploadProps } from '../types';

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
  useSucessState,
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
    showDefault ||
    !isAvatarUploaded ||
    (!useSucessState && !errorCode && !isProgressContentVisible);

  const shouldShowSuccessContent =
    !showDefault &&
    isAvatarUploaded &&
    !errorCode &&
    !isProgressContentVisible &&
    useSucessState;

  const successContent = (
    <SuccessContent
      open={() => setShowDefault(true)}
      handleFileRemove={handleFileRemove}
    />
  );

  const defaultContent = (
    <DefaultContent
      isSimplified={isSimplified}
      open={open}
      fileOptions={fileOptions}
      isDragAccept={isDragAccept}
    />
  );
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
    <div className="w-full">
      <div
        className="flex md:flex-col w-full"
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
