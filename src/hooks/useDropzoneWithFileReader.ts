import { DropzoneOptions, DropzoneProps, useDropzone } from 'react-dropzone';

import { DEFAULT_MIME_TYPES, DEFAULT_MAX_FILE_SIZE, DEFAULT_MAX_FILE_LIMIT } from '~shared/FileUpload/limits';
import { HandleFileAccept } from '~shared/FileUpload/types';
import getFileReader from '~utils/fileReader';

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
    ...restDropzoneOptions,
  });

  return dropzoneState;
};

export default useDropzoneWithFileReader;
