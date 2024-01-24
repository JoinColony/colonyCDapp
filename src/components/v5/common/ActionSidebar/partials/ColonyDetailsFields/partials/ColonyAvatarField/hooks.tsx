import { useState } from 'react';
import { FileRejection } from 'react-dropzone';

import {
  getOptimisedAvatarUnder300KB,
  getOptimisedThumbnail,
} from '~images/optimisation';
import { FileReaderFile } from '~utils/fileReader/types';
import {
  DropzoneErrors,
  getFileRejectionErrors,
} from '~v5/common/AvatarUploader/utils';

export const useChangeColonyAvatar = () => {
  const [modalValue, setModalValue] = useState<{
    image: string;
    thumbnail: string | null;
  } | null>(null);
  const [avatarFileError, setAvatarFileError] = useState<DropzoneErrors>();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileRemove = async () => {
    setModalValue(null);
    setAvatarFileError(undefined);
  };

  const handleFileAccept = async (uploadedFile: FileReaderFile) => {
    if (!uploadedFile) return;

    setAvatarFileError(undefined);

    try {
      setIsLoading(true);

      const optimisedImage = await getOptimisedAvatarUnder300KB(
        uploadedFile.file,
      );
      const optimisedThumbnail = await getOptimisedThumbnail(uploadedFile.file);

      if (!optimisedImage) {
        return;
      }

      setModalValue({
        image: optimisedImage,
        thumbnail: optimisedThumbnail,
      });
    } catch (e) {
      setAvatarFileError(DropzoneErrors.DEFAULT);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileReject = (rejectedFiles: FileRejection[]) => {
    const fileError = getFileRejectionErrors(rejectedFiles)[0][0];
    setAvatarFileError(fileError.code as DropzoneErrors);
  };

  return {
    isLoading,
    modalValue,
    setModalValue,
    avatarFileError,
    handleFileAccept,
    handleFileReject,
    handleFileRemove,
  };
};
