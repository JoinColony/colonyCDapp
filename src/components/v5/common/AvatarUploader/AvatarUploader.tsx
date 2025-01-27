import clsx from 'clsx';
import React, { useEffect, useState, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useTablet } from '~hooks';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import { useAvatarUploader, type UseAvatarUploaderProps } from './hooks.ts';
import FileUpload from './partials/FileUpload.tsx';
import ProgressContent from './partials/ProgressContent.tsx';
import { type FileUploadProps, type AvatarUploaderProps } from './types.ts';
import { displayName } from './utils.ts';

const MSG = defineMessages({
  changeAvatar: {
    id: `${displayName}.changeAvatar`,
    defaultMessage: 'Change Avatar',
  },
  removeAvatar: {
    id: `${displayName}.removeAvatar`,
    defaultMessage: 'Remove Avatar',
  },
});

const AvatarUploader: FC<AvatarUploaderProps & UseAvatarUploaderProps> = ({
  avatarPlaceholder,
  avatarSrc,
  disabled = false,
  fileOptions,
  updateFn,
  SuccessComponent,
  uploaderText,
  uploaderShownByDefault = true,
  testId,
}) => {
  const {
    uploadAvatarError,
    isLoading,
    handleFileReject,
    handleFileRemove,
    handleFileUpload: handleFileAccept,
    showProgress,
    uploadProgress,
    file,
  } = useAvatarUploader({ updateFn });

  const [showUploader, setShowUploader] = useState(uploaderShownByDefault);

  const isTablet = useTablet();

  const isAvatarAvailable = !!avatarPlaceholder?.props?.src;
  const isAvatarUploaded = !!avatarSrc;

  const fileUploadProps: FileUploadProps = {
    dropzoneOptions: {
      disabled,
    },
    fileOptions,
    handleFileAccept,
    handleFileReject,
    handleFileRemove,
    errorCode: uploadAvatarError,
    isFileUploaded: isAvatarUploaded,
    isProgressContentVisible: showProgress,
    SuccessComponent,
  };

  useEffect(() => {
    if (!uploaderShownByDefault && uploadProgress === 100) {
      setShowUploader(false);
    }
  }, [uploadProgress, uploaderShownByDefault]);

  return (
    <div className="flex flex-col gap-4" data-testid={testId}>
      <div className="flex flex-row items-start gap-4">
        <div className="flex-shrink-0">
          {isLoading ? (
            <SpinnerLoader appearance={{ size: 'medium' }} />
          ) : (
            avatarPlaceholder
          )}
        </div>
        <div
          className={clsx(
            'flex min-h-[60px] w-full flex-col justify-between gap-2',
            {
              '!justify-center': showUploader && isTablet,
            },
          )}
        >
          {uploaderText && <p className="text-sm">{uploaderText}</p>}
          {!showUploader && (
            <div className="flex w-full flex-col gap-4 sm:flex-row">
              <Button
                mode="primarySolid"
                onClick={() => setShowUploader(true)}
                text={MSG.changeAvatar}
                size="small"
              />
              {isAvatarAvailable && (
                <Button
                  onClick={handleFileRemove}
                  mode="tertiary"
                  text={MSG.removeAvatar}
                  size="small"
                />
              )}
            </div>
          )}
          {!isTablet && showUploader && <FileUpload {...fileUploadProps} />}
          {showProgress && (
            <ProgressContent
              progress={uploadProgress}
              fileName={file.fileName}
              fileSize={file.fileSize}
              handleFileRemove={handleFileRemove}
            />
          )}
        </div>
      </div>
      {isTablet && showUploader && <FileUpload {...fileUploadProps} />}
    </div>
  );
};

AvatarUploader.displayName = displayName;

export default AvatarUploader;
