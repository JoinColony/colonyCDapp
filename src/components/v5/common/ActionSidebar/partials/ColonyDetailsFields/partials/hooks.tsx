import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import axios from 'axios';

import { FileRejection } from 'react-dropzone';
import { FileReaderFile } from '~utils/fileReader/types';
import {
  getOptimisedAvatarUnder300KB,
  getOptimisedThumbnail,
} from '~images/optimisation';
import { DropzoneErrors } from '~shared/AvatarUploader/helpers';
import { getFileRejectionErrors } from '~shared/FileUpload/utils';
import { convertBytes } from '~utils/convertBytes';
import { useColonyAvatarContext } from '~context/ColonyAvatarContext';

export const useChangeColonyAvatar = () => {
  const { setValue, watch } = useFormContext();
  const { colonyAvatarImage } = watch();
  const [avatarFileError, setAvatarFileError] = useState<DropzoneErrors>();
  const [showPropgress, setShowPropgress] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFileName] = useState({ fileName: '', fileSize: '' });
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { onSaveColonyAvatar, onSaveColonyThumbnail } =
    useColonyAvatarContext();

  const handleFileRemove = async () => {
    setValue('colonyAvatarImage', null, { shouldDirty: true });
    setValue('colonyThumbnail', null);
    setAvatarFileError(undefined);
  };

  const handleFileAccept = async (uploadedFile: FileReaderFile) => {
    if (!uploadedFile) return;

    setAvatarFileError(undefined);

    try {
      setShowPropgress(true);
      setIsLoading(true);
      const optimisedImage = await getOptimisedAvatarUnder300KB(
        uploadedFile.file,
      );
      const optimisedThumbnail = await getOptimisedThumbnail(uploadedFile.file);

      setFileName({
        fileName: uploadedFile?.file.name || '',
        fileSize: convertBytes(uploadedFile?.file.size, 0),
      });

      setValue('colonyAvatarImage', optimisedImage, { shouldDirty: true });
      setValue('colonyThumbnail', optimisedThumbnail);
      onSaveColonyAvatar(optimisedImage);
      onSaveColonyThumbnail(optimisedThumbnail);

      if (uploadedFile?.file) {
        setShowPropgress(true);

        const formData = new FormData();
        formData.append('file', optimisedImage || '');
        setUploadProgress(0);
        axios.post('', {
          onUploadProgress: ({ loaded, total = 0 }) => {
            setUploadProgress(Math.floor((loaded / total) * 100));
          },
        });
      }
    } catch (e) {
      setAvatarFileError(DropzoneErrors.DEFAULT);
    } finally {
      setIsLoading(false);
      setShowPropgress(false);
    }
  };

  const handleFileReject = (rejectedFiles: FileRejection[]) => {
    const fileError = getFileRejectionErrors(rejectedFiles)[0][0];
    setAvatarFileError(fileError.code as DropzoneErrors);
  };

  return {
    isLoading,
    showPropgress,
    avatarFileError,
    file,
    uploadProgress,
    handleFileAccept,
    handleFileReject,
    handleFileRemove,
    colonyAvatarImage,
  };
};
