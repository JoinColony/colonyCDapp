import { FileRejection } from 'react-dropzone';

export const getFileRejectionErrors = (rejectedFiles: FileRejection[]) => {
  return rejectedFiles.map((file) => file.errors);
};
