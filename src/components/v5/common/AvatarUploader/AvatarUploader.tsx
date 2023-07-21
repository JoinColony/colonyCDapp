import React, { FC, useRef, ReactElement } from 'react';

import FileUpload from './partials/FileUpload';
import { SpinnerLoader } from '~shared/Preloaders';
import { useAvatarUploader } from './hooks';
import { AvatarUploaderProps } from './types';

const displayName = 'v5.common.UserProfilePage.partials.AvatarUploader';

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
    />
  );
};

AvatarUploader.displayName = displayName;

export default AvatarUploader;
