import clsx from 'clsx';
import React, { useState, type FC } from 'react';

import { useTablet } from '~hooks';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';

import { useAvatarUploader, type UseAvatarUploaderProps } from './hooks.ts';
import FileUpload from './partials/FileUpload.tsx';
import ProgressContent from './partials/ProgressContent.tsx';
import { type AvatarUploaderProps } from './types.ts';
import { displayName } from './utils.ts';

const AvatarUploader: FC<AvatarUploaderProps & UseAvatarUploaderProps> = ({
  avatarPlaceholder,
  avatarSrc,
  disabled = false,
  fileOptions,
  updateFn,
  SuccessComponent,
  uploaderText,
}) => {
  const {
    uploadAvatarError,
    isLoading,
    handleFileReject,
    handleFileRemove,
    handleFileUpload,
    showPropgress,
    uploadProgress,
    file,
  } = useAvatarUploader({ updateFn });

  const isAvatarAvailable = !!avatarPlaceholder.props.src;

  const [showUploader, setShowUploader] = useState(false);

  const isTablet = useTablet();

  return (
    <div className="flex flex-col gap-4">
      <div
        className={clsx('flex flex-row items-start gap-4 md:items-center', {
          '!items-start': showUploader,
          '!items-center': (showUploader && isTablet) || !isAvatarAvailable,
        })}
      >
        <div className="flex-shrink-0">
          {isLoading ? (
            <SpinnerLoader appearance={{ size: 'medium' }} />
          ) : (
            avatarPlaceholder
          )}
        </div>
        <div className="flex w-full flex-col gap-2">
          {uploaderText && (
            <div className="text-sm text-gray-600">{uploaderText}</div>
          )}
          {(!isTablet || (isTablet && !showUploader)) && (
            <FileUpload
              dropzoneOptions={{
                disabled,
              }}
              fileOptions={fileOptions}
              handleFileAccept={handleFileUpload}
              handleFileReject={handleFileReject}
              handleFileRemove={handleFileRemove}
              errorCode={uploadAvatarError}
              isAvatarUploaded={!!avatarSrc}
              isProgressContentVisible={showPropgress}
              SuccessComponent={SuccessComponent}
              showUploader={showUploader}
              setShowUploader={setShowUploader}
              isAvatarAvailable={isAvatarAvailable}
            />
          )}
          {showPropgress && (
            <ProgressContent
              progress={uploadProgress}
              fileName={file.fileName}
              fileSize={file.fileSize}
              handleFileRemove={handleFileRemove}
            />
          )}
        </div>
      </div>
      {isTablet && showUploader && (
        <FileUpload
          dropzoneOptions={{
            disabled,
          }}
          fileOptions={fileOptions}
          handleFileAccept={handleFileUpload}
          handleFileReject={handleFileReject}
          handleFileRemove={handleFileRemove}
          errorCode={uploadAvatarError}
          isAvatarUploaded={!!avatarSrc}
          isProgressContentVisible={showPropgress}
          SuccessComponent={SuccessComponent}
          showUploader={showUploader}
          setShowUploader={setShowUploader}
        />
      )}
    </div>
  );
};

AvatarUploader.displayName = displayName;

export default AvatarUploader;
