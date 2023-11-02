import React, { FC } from 'react';

import FileUpload from './partials/FileUpload';
import {
  useAvatarUploader,
  useGetUploaderText,
  UseAvatarUploaderProps,
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
    <div className="flex sm:flex-row flex-col gap-4 sm:gap-2">
      <div className="flex items-center gap-4 sm:items-start sm:w-16 mr-4">
        <div className="flex-shrink-0">
          {getPlaceholder(isLoading, avatarPlaceholder)}
        </div>
        <div className="sm:hidden text-gray-600 text-sm">{uploaderText}</div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {/* <div className="hidden sm:block text-gray-600 text-sm">
          {uploaderText}
        </div> */}
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
