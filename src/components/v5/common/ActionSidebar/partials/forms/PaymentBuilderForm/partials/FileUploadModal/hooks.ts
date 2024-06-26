import Papa, { type ParseResult } from 'papaparse';
import { useState } from 'react';
import { type FileRejection } from 'react-dropzone';

import { getFileRejectionErrors } from '~shared/FileUpload/utils.ts';
import { type ExpenditurePayoutFieldValue } from '~types/expenditures.ts';
import { type FileReaderFile } from '~utils/fileReader/types.ts';
import { DropzoneErrors } from '~v5/common/AvatarUploader/utils.ts';

import { type CSVFileItem } from './types.ts';

const defaultValues = {
  address: '0x0000000000000000000000000000000000000000',
  tokenContractAddress: 'wrongToken',
  amount: '',
  claimDelay: '',
};

const isValueNumber = (value: string) =>
  typeof value === 'string' && !Number.isNaN(Number(value));

const prepareStructure = (file: CSVFileItem[]) => {
  const hasRightHeaders = file.some(
    (header) =>
      'address' in header ||
      'tokenContractAddress' in header ||
      'amount' in header ||
      'claimDelay' in header,
  );

  if (!hasRightHeaders) {
    return undefined;
  }

  const emptyRow = file.find(
    (item) =>
      !item.address &&
      !item.tokenContractAddress &&
      !item.amount &&
      !item.claimDelay,
  );

  const isAmountAndDelayNumber = file
    .filter((item) => item !== emptyRow)
    .every(
      (item) => isValueNumber(item.amount) && isValueNumber(item.claimDelay),
    );

  if (!isAmountAndDelayNumber) {
    return undefined;
  }

  return file
    .filter((item) => item !== emptyRow)
    .map((item) => ({
      recipientAddress: item.address || defaultValues.address,
      tokenAddress:
        item.tokenContractAddress || defaultValues.tokenContractAddress,
      amount:
        (item.amount.includes(',') ? defaultValues.amount : item.amount) ||
        defaultValues.amount,
      claimDelay:
        (item.claimDelay.includes('-')
          ? defaultValues.claimDelay
          : item.claimDelay) || defaultValues.claimDelay,
    }));
};

export const useUploadCSVFile = (
  handleFileUpload: (file: ParseResult<ExpenditurePayoutFieldValue>) => void,
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

  const setError = (error: DropzoneErrors) => {
    setFileError(error);
    setParsedFileValue(null);
    setProgress(0);
    setFile(undefined);
  };

  const handleFileAccept = (uploadedFile: FileReaderFile) => {
    if (!uploadedFile) return;

    setFileError(undefined);
    setProgress(0);

    try {
      setFile(uploadedFile);

      Papa.parse(uploadedFile.file, {
        complete: (result: ParseResult<CSVFileItem>) => {
          const dataDelimiterIndex = result.data.findIndex(
            (line, index) =>
              line[0] === 'Payment Details' && result.data[index - 1][0] === '',
          );

          const truncatedData = result.data.slice(dataDelimiterIndex + 2);

          if (truncatedData.length > 400) {
            setError(DropzoneErrors.STRUCTURE);
            return;
          }

          let reconstructedFile = '';
          truncatedData.map((line) => {
            reconstructedFile += `${line.join(',')}\n`;
            return reconstructedFile;
          });

          const parsedFile = Papa.parse(reconstructedFile, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header: string) => {
              return header
                .toLowerCase()
                .replace(/\([^)]*\)/g, '')
                .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
                .trim();
            },
          });

          const validResults = prepareStructure(parsedFile.data);

          if (!validResults) {
            setError(DropzoneErrors.STRUCTURE);
            return;
          }

          handleFileUpload(validResults);
          handleFileRemove();
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
