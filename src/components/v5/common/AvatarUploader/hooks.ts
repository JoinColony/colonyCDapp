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
import {
  DropzoneErrors,
  getFileRejectionErrors,
  validateMinimumFileDimensions,
} from './utils.ts';

export interface UseAvatarUploaderProps {
  updateFn: (
    avatar: string | null,
    thumbnail: string | null,
    setProgress: Dispatch<SetStateAction<number>>,
  ) => Promise<void>;
}

/**
 * @todo Investigate if it's sensible to unify useAvatarUploader & useChangeColonyAvatar
 */
export const useAvatarUploader = ({ updateFn }: UseAvatarUploaderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadAvatarError, setUploadAvatarError] = useState<DropzoneErrors>();

  const [showProgress, setShowProgress] = useState<boolean>();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [file, setFile] = useState({ fileName: '', fileSize: '' });

  const handleFileUpload = async (
    avatarFileToUpload: FileReaderFile | null,
  ) => {
    if (!avatarFileToUpload) {
      return;
    }

    const { file: avatarFile } = avatarFileToUpload;

    try {
      setUploadAvatarError(undefined);
      setIsLoading(true);

      const avatar = await getOptimisedAvatarUnder300KB(avatarFile);

      setFile({
        fileName: avatarFile.name || '',
        fileSize: convertBytes(avatarFile.size, 0),
      });

      const thumbnail = await getOptimisedThumbnail(avatarFile);

      await validateMinimumFileDimensions(avatarFile);

      await updateFn(avatar, thumbnail, setUploadProgress);
    } catch (error) {
      const { message: errorMessage } = error;

      if (errorMessage.includes('exceeded the maximum')) {
        setUploadAvatarError(DropzoneErrors.TOO_LARGE);
      } else if (
        // Here's where this comes from: https://github.com/nodeca/pica/blob/e4e661623a14160a824087c6a66059e3b6dba5a0/index.js#L653
        errorMessage.includes(
          "Pica: cannot use getImageData on canvas, make sure fingerprinting protection isn't enabled",
        )
      ) {
        setUploadAvatarError(DropzoneErrors.FINGERPRINT_ENABLED);
      } else if (errorMessage === DropzoneErrors.DIMENSIONS_TOO_SMALL) {
        setUploadAvatarError(DropzoneErrors.DIMENSIONS_TOO_SMALL);
      } else {
        setUploadAvatarError(DropzoneErrors.DEFAULT);
      }
    } finally {
      setIsLoading(false);
      setShowProgress(false);
    }
  };

  const handleFileRemove = async () => {
    await updateFn(null, null, setUploadProgress);
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
