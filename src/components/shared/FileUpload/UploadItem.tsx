import React, { SyntheticEvent, useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { useFieldArray, useFormContext } from 'react-hook-form';

import fileReader from '~utils/fileReader';

import Button from '../Button';
import Icon from '../Icon';
import { Tooltip } from '../Popover';
import ProgressBar from '../ProgressBar';
import {
  FileUploadFormValues,
  HookFormUploadItemComponentProps,
  UploadFile,
} from './types';
import styles from './UploadItem.css';

const MSG = defineMessages({
  removeActionText: {
    id: 'UploadItem.removeActionText',
    defaultMessage: 'Remove',
  },
});

const displayName = 'UploadItem';

const UploadItem = ({
  accept,
  error,
  idx,
  maxFileSize,
  name,
  upload,
}: HookFormUploadItemComponentProps) => {
  const { setError } = useFormContext();
  const { fields, update, remove } = useFieldArray<FileUploadFormValues>({
    name,
  });
  const value = fields[idx];
  const { file, uploaded } = value as UploadFile;

  const readFiles = fileReader({
    maxFilesLimit: 1,
    maxFileSize,
    allowedTypes: accept,
  });

  const read = async () => {
    const [contents] = await readFiles([file]);
    return contents;
  };

  const handleRemoveClick = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    remove(idx);
  };

  const uploadFile = async () => {
    let readFile;
    let fileReference;
    try {
      readFile = await read();
      update(idx, { ...value, preview: readFile.data });
      fileReference = await upload(readFile);
    } catch (caughtError) {
      console.error(caughtError);
      setError(name, { message: caughtError });
      update(idx, {
        ...value,
        errors: [{ message: caughtError, code: 'uploadError' }],
      });
      return;
    }
    update(idx, {
      ...value,
      preview: readFile.data,
      uploaded: fileReference,
    });
  };

  useEffect(() => {
    if (file && !error && !uploaded) {
      uploadFile();
    }
    // Only upload on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.uploadItem} aria-invalid={!!error}>
      <div className={styles.fileInfo}>
        <Tooltip
          placement="left"
          content={error || null}
          trigger={error ? 'hover' : null}
        >
          <span className={styles.itemIcon}>
            <Icon name="file" title={file.name} />
          </span>
        </Tooltip>
        {uploaded || error ? (
          <span>{file.name}</span>
        ) : (
          <div className={styles.itemProgress}>
            <ProgressBar value={uploaded ? 100 : 0} />
          </div>
        )}
      </div>
      <div>
        <Button
          type="button"
          onClick={handleRemoveClick}
          appearance={{ theme: 'blue' }}
          text={MSG.removeActionText}
        />
      </div>
    </div>
  );
};

UploadItem.displayName = displayName;

export default UploadItem;
