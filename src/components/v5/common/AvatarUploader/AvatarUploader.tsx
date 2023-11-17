import React, { FC } from 'react';
import clsx from 'clsx';

import FileUpload from './partials/FileUpload';
import {
  useAvatarUploader,
  UseAvatarUploaderProps,
  useGetUploaderText,
} from './hooks';
import { AvatarUploaderProps } from './types';
import ProgressContent from './partials/ProgressContent';
import { getPlaceholder } from './utils';

const displayName = 'v5.common.AvatarUploader';

const AvatarUploader: FC<AvatarUploaderProps & UseAvatarUploaderProps> = ({
  avatarPlaceholder,
  avatarPlaceholder: {
    props: { avatar },
  },
  disabled = false,
  fileOptions,
  updateFn,
  useSucessState = true,
  showUploaderText = true,
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

  const uploaderText = useGetUploaderText(fileOptions);

  return (
    <div className="flex sm:flex-row flex-col gap-4">
      <div
        className={clsx('flex items-center sm:items-start', {
          'gap-4': showUploaderText,
        })}
      >
        <div className="flex-shrink-0">
          {getPlaceholder(isLoading, avatarPlaceholder)}
        </div>
        {showUploaderText && (
          <div className="sm:hidden text-gray-600 text-sm">{uploaderText}</div>
        )}
      </div>
      <div className="flex flex-col gap-2 w-full">
        {showUploaderText && (
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
          useSucessState={useSucessState}
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
