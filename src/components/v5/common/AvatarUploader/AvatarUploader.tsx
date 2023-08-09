import React, { FC, useRef, ReactElement } from 'react';

import FileUpload from './partials/FileUpload';
import { SpinnerLoader } from '~shared/Preloaders';
import { useAvatarUploader } from './hooks';
import { AvatarUploaderProps } from './types';
import ProgressContent from './partials/ProgressContent';

const displayName = 'v5.common.AvatarUploader';

const AvatarUploader: FC<AvatarUploaderProps> = ({
  avatarPlaceholder,
  disabled = false,
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

  return (
    <form>
      <FileUpload
        dropzoneOptions={{
          disabled,
        }}
        handleFileAccept={handleFileUpload}
        handleFileReject={handleFileReject}
        handleFileRemove={handleFileRemove}
        placeholder={getPlaceholder(isLoading, avatarPlaceholder)}
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
    </form>
  );
};

AvatarUploader.displayName = displayName;

export default AvatarUploader;
