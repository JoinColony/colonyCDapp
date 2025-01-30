import Papa, { type ParseResult } from 'papaparse';
import { useEffect, useState } from 'react';
import { type FileRejection } from 'react-dropzone';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
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
  const [previouslyAttemptedFileName, setPreviouslyAttemptedFileName] =
    useState<string | undefined>();
  const [parsedFileValue, setParsedFileValue] =
    useState<ParseResult<ExpenditurePayoutFieldValue> | null>(null);
  const [fileError, setFileError] = useState<DropzoneErrors>();

  useEffect(() => {
    return () => {
      setPreviouslyAttemptedFileName(undefined);
    };
  }, []);

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
      setPreviouslyAttemptedFileName(uploadedFile.name);

      Papa.parse(uploadedFile.file, {
        complete: (result: ParseResult<CSVFileItem>) => {
          const dataDelimiterIndex = result.data.findIndex(
            (line, index) =>
              line[0] === 'Payment Details' && result.data[index - 1][0] === '',
          );

          const truncatedData = result.data.slice(dataDelimiterIndex + 2);

          // Max number of payments is 400, but the format requires two header rows
          if (truncatedData.length > 402) {
            setError(DropzoneErrors.CONTENT_TOO_LARGE);
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
    previouslyAttemptedFileName,
  };
};

export const useCSVFileTemplate = () => {
  const { totalContributors } = useMemberContext();
  const { colony } = useColonyContext();

  const csvTemplate = [
    `
Instructions here: https://go.clny.io/csv

Address Book

Username (for reference),Address (for reference)`,
  ];

  totalContributors.map((contributor) => {
    return csvTemplate.push(
      `${contributor?.user?.profile?.displayName},${contributor?.contributorAddress}`,
    );
  });

  csvTemplate.push(
    `
Token List

Symbol (for reference),Token Contract Address (for reference)`,
  );

  colony?.tokens?.items?.map((token) => {
    return csvTemplate.push(
      `${token?.token?.symbol},${token?.token?.tokenAddress}`,
    );
  });

  csvTemplate.push(
    `
Payment Details

Username (for reference),Address,Token Symbol (for reference),Token Contract Address,Amount,Claim delay (hours)
Arjun,0x0000000000000000000000000000000000000000,USDC,0xaf88d065e77c8cC2239327C5EDb3A432268e5831,200000,24
Bob,0x0000000000000000000000000000000000000000,USDT,0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9,100000,12
Chika,0x0000000000000000000000000000000000000000,DAI,0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1,50000,6
Dana,0x0000000000000000000000000000000000000000,CLNY,0xD611b29dc327723269Bd1e53Fe987Ee71A24B234,5000,1
Erlich,0x0000000000000000000000000000000000000000,ETH,0x0000000000000000000000000000000000000000,5000,1`,
  );

  return csvTemplate.join('\n');
};
