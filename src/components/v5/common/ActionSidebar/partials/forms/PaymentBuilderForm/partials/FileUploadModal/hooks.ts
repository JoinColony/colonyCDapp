import Papa, { type ParseResult } from 'papaparse';
import { useState } from 'react';
import { type FileRejection } from 'react-dropzone';

import { getFileRejectionErrors } from '~shared/FileUpload/utils.ts';
import { type ExpenditurePayoutFieldValue } from '~types/expenditures.ts';
import { type FileReaderFile } from '~utils/fileReader/types.ts';
import { DropzoneErrors } from '~v5/common/AvatarUploader/utils.ts';

import { type CSVFileItem } from './types.ts';

const defaultValues = {
  recipient: '0x0000000000000000000000000000000000000000',
  tokenContractAddress: '0x0000000000000000000000000000000000000000',
  amount: '0',
  claimDelay: '0',
};

const isValueNumber = (value: string) =>
  typeof value === 'string' &&
  value.trim() !== '' &&
  !Number.isNaN(Number(value));

const validateFile = (file: ExpenditurePayoutFieldValue[]) => {
  const isRecipientValid = file.every((item) =>
    item.recipientAddress.startsWith('0x'),
  );
  const isAmountAndDelayNumber = file.every(
    (item) => isValueNumber(item.amount) && isValueNumber(item.claimDelay),
  );
  const hasWrongHeaders = file.every(
    (item) =>
      !item.recipientAddress ||
      !item.recipientAddress ||
      !item.amount ||
      !item.claimDelay,
  );

  if (!isRecipientValid) {
    return DropzoneErrors.RECIPIENT;
  }

  if (!isAmountAndDelayNumber || hasWrongHeaders) {
    return DropzoneErrors.STRUCTURE;
  }

  return undefined;
};

const prepareStructure = (file: CSVFileItem[]) => {
  const emptyRow = file.find(
    (item) =>
      !item.recipient &&
      !item.tokenContractAddress &&
      !item.amount &&
      !item.claimDelay,
  );

  return file
    .filter((item) => item !== emptyRow)
    .map((item) => ({
      recipientAddress: item.recipient || defaultValues.recipient,
      tokenAddress:
        item.tokenContractAddress || defaultValues.tokenContractAddress,
      amount: item.amount.replace(',', '.') || defaultValues.amount,
      claimDelay: item.claimDelay.replace('-', '') || defaultValues.claimDelay,
    }));
};

export const useUploadCSVFile = (
  handleFileUpload: (file: ParseResult<unknown>) => void,
) => {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<FileReaderFile | undefined>();
  const [parsedFileValue, setParsedFileValue] =
    useState<ParseResult<ExpenditurePayoutFieldValue> | null>(null);
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
          if (result.data.length > 400) {
            setFileError(DropzoneErrors.STRUCTURE);
            setParsedFileValue(null);
            setProgress(0);
            setFile(undefined);
            return;
          }

          const validResults = prepareStructure(result.data);
          const structureError = validateFile(validResults);

          if (structureError) {
            setFileError(structureError);
            setParsedFileValue(null);
            setProgress(0);
            setFile(undefined);
            return;
          }

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
