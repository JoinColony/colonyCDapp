import React, { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import {
  FileUploadFormValues,
  HookFormUploadItemComponentProps,
  UploadedFile,
} from '~shared/FileUpload/types';

import fileReader from '~utils/fileReader';
import Icon from '../Icon';

import styles from './AvatarUploadItem.css';

const displayName = 'AvatarUploadItem';

const AvatarUploadItem = ({
  accept,
  error,
  maxFileSize,
  name,
  idx,
  upload,
  handleError,
}: HookFormUploadItemComponentProps) => {
  const { reset, setError } = useFormContext();
  const { fields, update } = useFieldArray<FileUploadFormValues>({
    name,
  });
  const value = fields[idx];
  const { file, preview, uploaded } = value as UploadedFile;

  const readFiles = fileReader({
    maxFilesLimit: 1,
    maxFileSize,
    allowedTypes: accept,
  });

  const read = async () => {
    const [contents] = await readFiles([file]);
    return contents;
  };

  const uploadFile = async () => {
    let readFile;
    try {
      readFile = await read();
      const uploadedFile = await upload(readFile);
      update(idx, {
        ...value,
        preview: readFile.data,
        uploaded: uploadedFile,
      });
    } catch (e) {
      console.error(e);
      update(idx, { ...value, errors: [{ message: e, code: 'uploadError' }] });
      setError(name, { message: e });
    }
    // After successfully uploading the file we'd like to immediately remove it again.
    reset();
  };

  useEffect(() => {
    if (file && !error && !uploaded) {
      uploadFile();
    }
    if (error && handleError) {
      handleError({ ...value, file });
    }
  }, [handleError, file, error, uploadFile, uploaded, value]);

  return (
    <div className={styles.main}>
      {!error ? (
        <div
          className={styles.previewImage}
          style={{ backgroundImage: preview ? `url(${preview}` : undefined }}
        >
          <div className={styles.overlay}>
            <div className={styles.loader} />
          </div>
        </div>
      ) : (
        <div className={styles.error}>
          <Icon name="file" appearance={{ size: 'large' }} title={error} />
        </div>
      )}
    </div>
  );
};

AvatarUploadItem.displayName = displayName;

export default AvatarUploadItem;
