import React, { FC, useRef, ReactElement } from 'react';
import { useIntl } from 'react-intl';

import FileUpload from './partials/FileUpload';
import { SpinnerLoader } from '~shared/Preloaders';
import { useAvatarUploader, useFormatFormats } from './hooks';
import { AvatarUploaderProps } from './types';
import ProgressContent from './partials/ProgressContent';

const displayName = 'v5.common.AvatarUploader';

const AvatarUploader: FC<AvatarUploaderProps> = ({
  avatarPlaceholder,
  disabled = false,
  fileOptions,
}) => {
  const {
    user,
    uploadAvatarError,
    isLoading,
    handleFileReject,
    handleFileRemove,
    handleFileUpload,
    showPropgress,
    uploadProgress,
    file,
  } = useAvatarUploader();
  const dropzoneRef = useRef<{ open: () => void }>();
  const { formatMessage } = useIntl();

  const getPlaceholder = (
    loading: boolean,
    avatar: ReactElement<
      unknown,
      string | React.JSXElementConstructor<unknown>
    >,
  ) => {
    if (loading) {
      return <SpinnerLoader appearance={{ size: 'medium' }} />;
    }

    return avatar;
  };

  const { fileDimension, fileFormat, fileSize } = fileOptions;
  const formattedFormats = useFormatFormats(fileFormat);

  const uploaderText = formatMessage(
    { id: 'avatar.uploader.info' },
    {
      format: formattedFormats,
      dimension: fileDimension,
      size: fileSize,
    },
  );
  const avatar = (
    <div className="flex items-center gap-4 sm:items-start sm:w-16 mr-4">
      <div className="flex-shrink-0">
        {getPlaceholder(isLoading, avatarPlaceholder)}
      </div>
      <div className="sm:hidden text-gray-600 text-sm">{uploaderText}</div>
    </div>
  );

  return (
    <div className="flex sm:flex-row flex-col gap-4 sm:gap-2">
      {avatar}
      <div className="flex flex-col gap-2 w-full">
        <div className="hidden sm:block text-gray-600 text-sm">
          {uploaderText}
        </div>
        <FileUpload
          dropzoneOptions={{
            disabled,
          }}
          fileOptions={fileOptions}
          handleFileAccept={handleFileUpload}
          handleFileReject={handleFileReject}
          handleFileRemove={handleFileRemove}
          forwardedRef={dropzoneRef}
          errorCode={uploadAvatarError}
          isAvatarUploaded={user?.profile?.avatar !== null}
          isPropgressContentVisible={showPropgress}
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
