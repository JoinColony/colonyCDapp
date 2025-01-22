import { useMemo } from 'react';
import {
  type DropzoneOptions,
  type DropzoneProps,
  useDropzone,
} from 'react-dropzone';

import getFileReader from '~utils/fileReader/index.ts';
import { type HandleFileAccept } from '~v5/common/AvatarUploader/types.ts';
import {
  DEFAULT_MIME_TYPES,
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_FILE_LIMIT,
} from '~v5/common/AvatarUploader/utils.ts';

const useDropzoneWithFileReader = ({
  dropzoneOptions: {
    accept = DEFAULT_MIME_TYPES,
    maxSize = DEFAULT_MAX_FILE_SIZE,
    maxFiles = DEFAULT_MAX_FILE_LIMIT,
    ...restDropzoneOptions
  },
  handleFileAccept,
  handleFileReject,
}: {
  dropzoneOptions: DropzoneOptions;
  handleFileAccept: HandleFileAccept;
  handleFileReject?: DropzoneProps['onDropRejected'];
}) => {
  const fileReader = getFileReader({
    maxFilesLimit: maxFiles,
    maxFileSize: maxSize,
    allowedTypes: accept,
  });

  const onDropAccepted = async (acceptedFiles: File[]) => {
    const fileData = await fileReader(acceptedFiles);
    fileData.forEach((file) => {
      handleFileAccept(file);
    });
  };

  const dropzoneState = useDropzone({
    accept,
    maxSize,
    maxFiles,
    onDropAccepted,
    onDropRejected: handleFileReject,
    multiple: maxFiles > 1,
    noClick: true,
    noKeyboard: true,
    ...restDropzoneOptions,
  });

  const processedFiles = useMemo(() => {
    const { fileRejections, acceptedFiles } = dropzoneState;

    return { ...fileRejections.map(({ file }) => file), ...acceptedFiles };
  }, [dropzoneState]);

  return { ...dropzoneState, processedFiles };
};

export default useDropzoneWithFileReader;
