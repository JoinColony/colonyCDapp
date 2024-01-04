import { Dispatch, SetStateAction, useState } from 'react';
import { FileRejection } from 'react-dropzone';
import { useIntl } from 'react-intl';

import {
  getOptimisedAvatarUnder300KB,
  getOptimisedThumbnail,
} from '~images/optimisation';
import { DropzoneErrors } from '~shared/AvatarUploader/helpers';
import { getFileRejectionErrors } from '~shared/FileUpload/utils';
import { convertBytes } from '~utils/convertBytes';
import { FileReaderFile } from '~utils/fileReader/types';

import { FileUploadOptions } from './types';

export interface UseAvatarUploaderProps {
  updateFn: (
    avatar: string | null,
    thumbnail: string | null,
    setProgress: Dispatch<SetStateAction<number>>,
  ) => Promise<void>;
}

export const useAvatarUploader = ({ updateFn }: UseAvatarUploaderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadAvatarError, setUploadAvatarError] = useState<DropzoneErrors>();

  const [showPropgress, setShowPropgress] = useState<boolean>();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [file, setFileName] = useState({ fileName: '', fileSize: '' });

  const handleFileUpload = async (avatarFile: FileReaderFile | null) => {
    if (avatarFile) {
      setUploadAvatarError(undefined);
      setIsLoading(true);
    }

    try {
      const avatar = await getOptimisedAvatarUnder300KB(avatarFile?.file);
      setFileName({
        fileName: avatarFile?.file.name || '',
        fileSize: convertBytes(avatarFile?.file.size, 0),
      });

      const thumbnail = await getOptimisedThumbnail(avatarFile?.file);

      await updateFn(avatar, thumbnail, setUploadProgress);
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

export const useFormatFormats = (fileFormats: string[]) => {
  const { formatMessage } = useIntl();

  return fileFormats
    .map((format, index) => {
      if (fileFormats.length === 1) {
        return format;
      }

      if (index === fileFormats.length - 1) {
        return `${formatMessage({ id: 'avatar.uploader.or' })} ${format}`;
      }

      return format;
    })
    .join(', ');
};

export const useGetUploaderText = (fileOptions: FileUploadOptions) => {
  const { formatMessage } = useIntl();

  const { fileDimension, fileFormat, fileSize } = fileOptions;

  const formattedFormats = useFormatFormats(fileFormat);

  return formatMessage(
    { id: 'avatar.uploader.info' },
    {
      format: formattedFormats,
      dimension: fileDimension,
      size: fileSize,
    },
  );
};
