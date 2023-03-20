import React, { useEffect, SyntheticEvent, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import { UploadItemComponentProps } from '~shared/FileUpload/types';
import { SpinnerLoader } from '~shared/Preloaders';
import Button from '~shared/Button';
import { FileReaderFile } from '~utils/fileReader/types';

import styles from './CSVUploaderItem.css';

const displayName = 'CSVUploader.CSVUploaderItem';

const MSG = defineMessages({
  removeCSVText: {
    id: `${displayName}.removeCSVText`,
    defaultMessage: 'Remove',
  },
  processingText: {
    id: `${displayName}.processingText`,
    defaultMessage: 'Processing',
  },
});

const CSVUploaderItem = ({
  error,
  name,
  upload,
  processingData,
  handleProcessingData,
}: UploadItemComponentProps) => {
  const { watch } = useFormContext();
  const uploaderValue: FileReaderFile = watch(name);

  const handleRemoveClick = useCallback(
    (evt: SyntheticEvent<HTMLButtonElement>) => {
      evt.stopPropagation();
      upload(null);
    },
    [upload],
  );

  useEffect(() => {
    if (
      !uploaderValue?.file &&
      !error &&
      handleProcessingData &&
      !processingData
    ) {
      handleProcessingData(true);
    }
  }, [error, uploaderValue, handleProcessingData, processingData]);

  if (processingData || !uploaderValue?.file) {
    return (
      <div className={styles.loadingSpinnerContainer}>
        <SpinnerLoader
          loadingText={MSG.processingText}
          appearance={{ theme: 'primary', size: 'small', layout: 'horizontal' }}
        />
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <span className={styles.fileName}>{uploaderValue?.file.name}</span>
      <div>
        <Button
          type="button"
          onClick={handleRemoveClick}
          appearance={{ theme: 'blue' }}
          text={MSG.removeCSVText}
        />
      </div>
    </div>
  );
};

CSVUploaderItem.displayName = displayName;

export default CSVUploaderItem;
