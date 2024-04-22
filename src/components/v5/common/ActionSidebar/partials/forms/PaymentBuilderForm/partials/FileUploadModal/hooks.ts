import { isAddress } from 'ethers/lib/utils';
import Papa, { type ParseResult } from 'papaparse';
import { useState } from 'react';
import { type FileRejection } from 'react-dropzone';

import { getFileRejectionErrors } from '~shared/FileUpload/utils.ts';
import { type FileReaderFile } from '~utils/fileReader/types.ts';
import { DropzoneErrors } from '~v5/common/AvatarUploader/utils.ts';

const validateStructure = (file) => {
  const isValidLength = file.every((row) => row.length === 4);

  if (!isValidLength) {
    return false;
  }

  const isValidRecipient = file.every(([recipient]) => isAddress(recipient));
  const isValidToken = file.every(([, token]) => isAddress(token));

  if (!isValidRecipient || !isValidToken) {
    return false;
  }

  return true;
};

export const useUploadCSVFile = (
  handleFileUpload: (file: ParseResult<unknown>) => void,
) => {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<FileReaderFile | undefined>();
  const [parsedFileValue, setParsedFileValue] =
    useState<ParseResult<unknown> | null>(null);
  const [fileError, setFileError] = useState<DropzoneErrors>();

  const handleFileRemove = async () => {
    setParsedFileValue(null);
    setFileError(undefined);
    setProgress(0);
  };

  const handleFileAccept = (uploadedFile: FileReaderFile) => {
    if (!uploadedFile) return;

    setFileError(undefined);
    setProgress(0);

    try {
      setFile(uploadedFile);

      Papa.parse(uploadedFile.file, {
        complete: (result: ParseResult<unknown>) => {
          const isValid = validateStructure(result.data.slice(1));

          if (!isValid) {
            setFileError(DropzoneErrors.STRUCTURE);
            setProgress(0);
            return;
          }

          handleFileUpload(result);
          handleFileRemove();
        },
        header: false,
      });
    } catch (e) {
      setFileError(DropzoneErrors.DEFAULT);
    } finally {
      setProgress(100);
    }
  };

  const handleFileReject = (rejectedFiles: FileRejection[]) => {
    const fileRejection = getFileRejectionErrors(rejectedFiles)[0][0];
    setFileError(fileRejection.code as DropzoneErrors);
  };

  return {
    parsedFileValue,
    fileError,
    handleFileAccept,
    handleFileReject,
    handleFileRemove,
    progress,
    file,
  };
};
