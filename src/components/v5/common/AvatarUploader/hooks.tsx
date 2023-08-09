import React, { useState } from 'react';
import { FileRejection } from 'react-dropzone';
import { toast } from 'react-toastify';
import axios from 'axios';

import { useAppContext, useCanEditProfile } from '~hooks';
import { DropzoneErrors } from '~shared/AvatarUploader/helpers';
import { getFileRejectionErrors } from '~shared/FileUpload/utils';
import { FileReaderFile } from '~utils/fileReader/types';
import {
  getOptimisedAvatarUnder300KB,
  getOptimisedThumbnail,
} from '~images/optimisation';
import { useUpdateUserProfileMutation } from '~gql';
import Toast from '~shared/Extensions/Toast';
import { convertBytes } from '~utils/convertBytes';

export const useAvatarUploader = () => {
  const { updateUser } = useAppContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadAvatarError, setUploadAvatarError] = useState<DropzoneErrors>();
  const [updateAvatar] = useUpdateUserProfileMutation();

  const [showPropgress, setShowPropgress] = useState<boolean>();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [file, setFileName] = useState({ fileName: '', fileSize: '' });

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
      setFileName({
        fileName: avatarFile?.file.name || '',
        fileSize: convertBytes(avatarFile?.file.size, 0),
      });

      if (avatarFile?.file) {
        setShowPropgress(true);
      }

      const formData = new FormData();
      formData.append('file', updatedAvatar || '');
      setUploadProgress(0);
      axios.post('', formData, {
        onUploadProgress: ({ loaded, total = 0 }) => {
          setUploadProgress(Math.floor((loaded / total) * 100));
        },
      });

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

      toast.success(
        <Toast
          type="success"
          title={{ id: 'upload.avatar.successfully.toast.title' }}
          description={{
            id: 'upload.avatar.successfully.toast.description',
          }}
        />,
      );
    } catch (e) {
      if (e.message.includes('exceeded the maximum')) {
        setUploadAvatarError(DropzoneErrors.TOO_LARGE);
      } else {
        setUploadAvatarError(DropzoneErrors.DEFAULT);
      }
    } finally {
      setIsLoading(false);
      setShowPropgress(false);
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
    showPropgress,
    uploadProgress,
    file,
  };
};
