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
          {isLoading ? (
            <SpinnerLoader appearance={{ size: 'medium' }} />
          ) : (
            avatarPlaceholder
          )}
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
