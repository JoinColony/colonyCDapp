import clsx from 'clsx';
import React, { type FC } from 'react';

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

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div
        className={clsx('flex items-center sm:items-start', {
          'gap-4': uploaderText,
        })}
      >
        <div className="flex-shrink-0">
          {isLoading ? (
            <SpinnerLoader appearance={{ size: 'medium' }} />
          ) : (
            avatarPlaceholder
          )}
        </div>
        {uploaderText && (
          <div className="text-sm text-gray-600 sm:hidden">{uploaderText}</div>
        )}
      </div>
      <div className="flex w-full flex-col gap-2">
        {uploaderText && (
          <div className="hidden text-sm text-gray-600 sm:block">
            {uploaderText}
          </div>
        )}
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
        />
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
  );
};

AvatarUploader.displayName = displayName;

export default AvatarUploader;
