import React, { useState, useEffect } from 'react';
import Papa, { ParseResult } from 'papaparse';
import { useFormContext } from 'react-hook-form';
import { MessageDescriptor } from 'react-intl';

import { FileReaderFile } from '~utils/fileReader/types';
import { InputStatus } from '~shared/Fields';
import { isEqual, isNil } from '~utils/lodash';

import { DefaultPlaceholder, SingleFileUpload } from '../FileUpload';

import CSVUploaderItem from './CSVUploaderItem';

interface Props {
  name: string;
  processingData: boolean;
  setProcessingData: React.Dispatch<React.SetStateAction<boolean>>;
  status?: string | MessageDescriptor;
  error?: string | MessageDescriptor;
  setHasFile?: React.Dispatch<React.SetStateAction<boolean>>;
}

const MIME_TYPES = {
  'text/csv': [],
};

const CSVUploader = ({
  name,
  error,
  status,
  processingData,
  setProcessingData,
  setHasFile,
}: Props) => {
  const [CSVFile, setCSVFile] = useState<FileReaderFile | null>(null);
  const [parsedCSV, setParsedCSV] = useState<ParseResult<unknown> | null>(null);
  const { setValue, watch, trigger } = useFormContext();
  const uploaderValue = watch(name);

  const handleUploadError = async () => {
    if (isNil(uploaderValue?.parsedData)) {
      setValue(name, { ...CSVFile, parsedData: [] });
    }
  };

  useEffect(() => {
    if (CSVFile && !parsedCSV) {
      Papa.parse(CSVFile.file, {
        complete: setParsedCSV,
        header: true,
      });

      if (setHasFile) setHasFile(true);
    } else if (!CSVFile && parsedCSV) {
      setParsedCSV(null);
      setValue(name, null);
      if (setHasFile) setHasFile(false);
    }
  }, [setHasFile, CSVFile, parsedCSV, name, setValue]);

  useEffect(() => {
    if (parsedCSV && isNil(uploaderValue?.parsedData)) {
      let validAddresses: string[] = [];
      if (parsedCSV.meta.fields?.length === 1) {
        validAddresses = parsedCSV.data.flatMap(
          (CSVRow: Record<string, any>) => {
            const potentialAddress: string = CSVRow[Object.keys(CSVRow)[0]];
            return potentialAddress ? [potentialAddress] : [];
          },
        );
      }

      if (!isEqual(validAddresses, uploaderValue?.parsedData)) {
        setValue(name, { ...CSVFile, parsedData: validAddresses });
        trigger(name);
      }
    }

    if (processingData) {
      setProcessingData(false);
    }
  }, [
    trigger,
    parsedCSV,
    uploaderValue,
    setValue,
    processingData,
    setProcessingData,
    name,
    CSVFile,
  ]);

  const getPlaceholder = () => {
    if (!CSVFile) {
      return <DefaultPlaceholder />;
    }

    return (
      <CSVUploaderItem
        error={error}
        name={name}
        upload={(file: FileReaderFile | null) => setCSVFile(file)}
        processingData={processingData}
        handleProcessingData={setProcessingData}
      />
    );
  };

  return (
    <>
      <SingleFileUpload
        handleFileAccept={setCSVFile}
        dropzoneOptions={{
          accept: MIME_TYPES,
        }}
        handleFileReject={handleUploadError}
        placeholder={getPlaceholder()}
      />
      <InputStatus
        appearance={{ theme: 'fat', textSpace: 'wrap' }}
        status={status}
        error={error}
      />
    </>
  );
};

CSVUploader.displayName = 'CSVUploader';

export default CSVUploader;
