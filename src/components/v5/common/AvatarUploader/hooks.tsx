import { useState } from 'react';
import { FileRejection } from 'react-dropzone';

import { useAppContext, useCanEditProfile } from '~hooks';
import { DropzoneErrors } from '~shared/AvatarUploader/helpers';
import { getFileRejectionErrors } from '~shared/FileUpload/utils';
import { FileReaderFile } from '~utils/fileReader/types';
import {
  getOptimisedAvatarUnder300KB,
  getOptimisedThumbnail,
} from '~images/optimisation';
import { useUpdateUserProfileMutation } from '~gql';

export const useAvatarUploader = () => {
  const { updateUser } = useAppContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadAvatarError, setUploadAvatarError] = useState<DropzoneErrors>();
  const [updateAvatar] = useUpdateUserProfileMutation();
  const { user } = useCanEditProfile();

  const handleFileUpload = async (avatarFile: FileReaderFile | null) => {
    if (avatarFile) {
      setUploadAvatarError(undefined);
      setIsLoading(true);
    }

    try {
      const updatedAvatar = await getOptimisedAvatarUnder300KB(
        avatarFile?.file,
      );
      const thumbnail = await getOptimisedThumbnail(avatarFile?.file);

      await updateAvatar({
        variables: {
          input: {
            // @ts-ignore
            id: user?.walletAddress,
            avatar: updatedAvatar,
            thumbnail,
          },
        },
      });

      await updateUser?.(user?.walletAddress, true);
    } catch (e) {
      if (e.message.includes('exceeded the maximum')) {
        setUploadAvatarError(DropzoneErrors.TOO_LARGE);
      } else {
        setUploadAvatarError(DropzoneErrors.DEFAULT);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileRemove = async () => {
    await handleFileUpload(null);
    setUploadAvatarError(undefined);
  };

  const handleFileReject = (rejectedFiles: FileRejection[]) => {
    const fileError = getFileRejectionErrors(rejectedFiles)[0][0];
    setUploadAvatarError(fileError.code as DropzoneErrors);
  };

  return {
    user,
    uploadAvatarError,
    isLoading,
    handleFileReject,
    handleFileRemove,
    handleFileUpload,
  };
};
