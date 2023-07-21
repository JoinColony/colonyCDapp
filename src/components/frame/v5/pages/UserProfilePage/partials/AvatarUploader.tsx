import React, { FC, useRef, ReactElement } from 'react';

import FileUpload from './FileUpload';
import { SpinnerLoader } from '~shared/Preloaders';
import { AvatarUploaderProps } from '../types';

const displayName = 'v5.pages.UserProfilePage.partials.AvatarUploader';

const AvatarUploader: FC<AvatarUploaderProps> = ({
  avatarPlaceholder,
  disabled = false,
  handleFileAccept,
  handleFileReject,
  handleFileRemove,
  errorCode,
  isLoading = false,
  user,
}) => {
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
      handleFileAccept={handleFileAccept}
      handleFileReject={handleFileReject}
      handleFileRemove={handleFileRemove}
      placeholder={getPlaceholder(isLoading, avatarPlaceholder)}
      forwardedRef={dropzoneRef}
      errorCode={errorCode}
      isAvatarUploaded={user?.profile?.avatar !== null}
    />
  );
};

AvatarUploader.displayName = displayName;

export default AvatarUploader;
