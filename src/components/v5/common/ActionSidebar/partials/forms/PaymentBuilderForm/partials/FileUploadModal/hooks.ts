import Papa, { type ParseResult } from 'papaparse';
import { useState } from 'react';
import { type FileRejection } from 'react-dropzone';

import { getFileRejectionErrors } from '~shared/FileUpload/utils.ts';
import { type FileReaderFile } from '~utils/fileReader/types.ts';
import { DropzoneErrors } from '~v5/common/AvatarUploader/utils.ts';

import { type CSVFileItem } from './types.ts';

const defaultValues = {
  recipient: '0x0000000000000000000000000000000000000000',
  tokenContractAddress: '0x0000000000000000000000000000000000000000',
  amount: '0',
  claimDelay: '0',
};

const validateStructure = (file: CSVFileItem[]) =>
  file.map((item) => ({
    recipient: item.recipient || defaultValues.recipient,
    tokenContractAddress:
      item.tokenContractAddress || defaultValues.tokenContractAddress,
    amount: item.amount || defaultValues.amount,
    claimDelay: item.claimDelay || defaultValues.claimDelay,
  }));

export const useUploadCSVFile = (
  handleFileUpload: (file: ParseResult<unknown>) => void,
) => {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<FileReaderFile | undefined>();
  const [parsedFileValue, setParsedFileValue] =
    useState<ParseResult<CSVFileItem> | null>(null);
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
        complete: (result: ParseResult<CSVFileItem>) => {
          const validResults = validateStructure(result.data);

          handleFileUpload(validResults);
          handleFileRemove();
        },
        header: true,
        transformHeader: (header: string) => {
          return header
            .toLowerCase()
            .replace(/\([^)]*\)/g, '')
            .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
            .trim();
        },
      });
    } catch (error) {
      setFileError(DropzoneErrors.DEFAULT);
    } finally {
      setProgress(100);
    }
  };

  const handleFileReject = (rejectedFiles: FileRejection[]) => {
    const fileRejection = getFileRejectionErrors(rejectedFiles)[0][0];
    if (fileRejection.code === 'file-invalid-type') {
      setFileError(DropzoneErrors.STRUCTURE);
      return;
    }

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
