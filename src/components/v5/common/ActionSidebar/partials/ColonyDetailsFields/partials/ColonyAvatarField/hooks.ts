import { useState } from 'react';
import { type FileRejection } from 'react-dropzone';

import {
  getOptimisedAvatarUnder300KB,
  getOptimisedThumbnail,
} from '~images/optimisation/index.ts';
import { type FileReaderFile } from '~utils/fileReader/types.ts';
import {
  DropzoneErrors,
  getFileRejectionErrors,
  validateMinimumFileDimensions,
} from '~v5/common/AvatarUploader/utils.ts';

/**
 * @todo Investigate if it's sensible to unify useAvatarUploader & useChangeColonyAvatar
 */
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

    try {
      const { file } = uploadedFile;

      setAvatarFileError(undefined);
      setIsLoading(true);

      const optimisedImage = await getOptimisedAvatarUnder300KB(file);
      const optimisedThumbnail = await getOptimisedThumbnail(file);

      if (!optimisedImage) {
        return;
      }

      await validateMinimumFileDimensions(file);

      setModalValue({
        image: optimisedImage,
        thumbnail: optimisedThumbnail,
      });
    } catch (error) {
      if (error.message === DropzoneErrors.DIMENSIONS_TOO_SMALL) {
        setAvatarFileError(DropzoneErrors.DIMENSIONS_TOO_SMALL);
      } else {
        setAvatarFileError(DropzoneErrors.DEFAULT);
      }
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
