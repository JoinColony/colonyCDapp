import clsx from 'clsx';
import React, { FC } from 'react';

import { useAvatarUploader, UseAvatarUploaderProps } from './hooks.tsx';
import FileUpload from './partials/FileUpload.tsx';
import ProgressContent from './partials/ProgressContent.tsx';
import { AvatarUploaderProps } from './types.ts';
import { getPlaceholder } from './utils.tsx';

const displayName = 'v5.common.AvatarUploader';

const AvatarUploader: FC<AvatarUploaderProps & UseAvatarUploaderProps> = ({
  avatarPlaceholder,
  avatarPlaceholder: {
    props: { avatar },
  },
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
    <div className="flex sm:flex-row flex-col gap-4">
      <div
        className={clsx('flex items-center sm:items-start', {
          'gap-4': uploaderText,
        })}
      >
        <div className="flex-shrink-0">
          {getPlaceholder(isLoading, avatarPlaceholder)}
        </div>
        {uploaderText && (
          <div className="sm:hidden text-gray-600 text-sm">{uploaderText}</div>
        )}
      </div>
      <div className="flex flex-col gap-2 w-full">
        {uploaderText && (
          <div className="hidden sm:block text-gray-600 text-sm">
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
          isAvatarUploaded={avatar}
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
