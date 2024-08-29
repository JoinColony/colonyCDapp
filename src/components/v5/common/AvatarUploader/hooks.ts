import { type Dispatch, type SetStateAction, useState } from 'react';
import { type FileRejection } from 'react-dropzone';
import { useIntl } from 'react-intl';

import {
  getOptimisedAvatarUnder300KB,
  getOptimisedThumbnail,
} from '~images/optimisation/index.ts';
import { convertBytes } from '~utils/convertBytes.ts';
import { type FileReaderFile } from '~utils/fileReader/types.ts';

import { type FileUploadOptions } from './types.ts';
import { DropzoneErrors, getFileRejectionErrors } from './utils.ts';

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

  const [showProgress, setShowProgress] = useState<boolean>();
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
      } else if (
        e.message.includes(
          "Pica: cannot use getImageData on canvas, make sure fingerprinting protection isn't enabled",
        )
      ) {
        setUploadAvatarError(DropzoneErrors.FINGERPRINT_ENABLED);
      } else {
        setUploadAvatarError(DropzoneErrors.DEFAULT);
      }
    } finally {
      setIsLoading(false);
      setShowProgress(false);
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
    showProgress,
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
