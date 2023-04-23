import React, { ComponentType, useImperativeHandle } from 'react';
import { defineMessages } from 'react-intl';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { withForwardingRef, ForwardedRefProps } from '~utils/hoc';
import { InputLabel, InputStatus } from '../Fields';

import DefaultPlaceholder from './DefaultPlaceholder';
import { DEFAULT_MIME_TYPES, DEFAULT_MAX_FILE_SIZE } from './limits';
import { FileUploadFormValues, UserFile, FileUploadProps } from './types';
import UploadItem from './UploadItem';

import styles from './FileUpload.css';

const displayName = 'FileUpload';

const MSG = defineMessages({
  labelError: {
    id: `${displayName}.labelError`,
    defaultMessage: 'There was an error processing your file. Try again.',
  },
  uploadError: {
    id: `${displayName}.uploadError`,
    defaultMessage: 'There was an error uploading your file',
  },
  filetypeError: {
    id: `${displayName}.filetypeError`,
    defaultMessage: 'This filetype is not allowed or file is too big',
  },
});

const isRejectedFile = (file: UserFile): file is FileRejection => {
  if ('errors' in file) {
    return true;
  }

  return false;
};

const FileUpload = ({
  appearance,
  children,
  classNames = styles,
  dropzoneOptions: { accept: acceptProp, disabled, ...dropzoneOptions } = {},
  elementOnly,
  extra,
  forwardedRef: ref,
  help,
  helpValues,
  hideStatus = true,
  itemComponent: FileUploaderItem = UploadItem,
  label,
  labelValues,
  maxFilesLimit = 1,
  maxSize = DEFAULT_MAX_FILE_SIZE,
  name,
  renderPlaceholder = <DefaultPlaceholder />,
  status,
  statusValues,
  upload,
  handleError,
  customErrorMessage,
  processingData,
  dataTest,
  handleProcessingData,
}: FileUploadProps & ForwardedRefProps) => {
  const { getFieldState, setError } = useFormContext();
  const { fields: files, append } = useFieldArray<FileUploadFormValues>({
    name,
  });
  const { error } = getFieldState(name);
  const maxFileLimitNotMet = files.length < maxFilesLimit;

  const accept = acceptProp || DEFAULT_MIME_TYPES;

  const onDropAccepted = (acceptedFiles: File[]) => {
    const acceptedFilesCount = files.filter(
      (file) => !isRejectedFile(file),
    ).length;
    const newFiles = acceptedFiles.slice(0, maxFilesLimit - acceptedFilesCount);
    newFiles.forEach((acceptedFile) => append({ file: acceptedFile }));
  };

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    rejectedFiles
      .slice(0, maxFilesLimit - files.length)
      .forEach((rejectedFile) => {
        append(rejectedFile);
        setError(name, { message: 'uploadRejected' });
      });
  };

  const dropzoneState = useDropzone({
    accept,
    disabled: disabled || !maxFileLimitNotMet,
    maxSize,
    onDropAccepted,
    onDropRejected,
    // We can override the above properties by providing these in the `dropzoneOptions` prop
    ...dropzoneOptions,
  });

  const { getRootProps, getInputProps, isDragAccept, isDragReject, open } =
    dropzoneState;

  const renderExtraChildren = () => {
    if (!children) return null;
    if (typeof children === 'function') {
      return children(dropzoneState);
    }
    return children;
  };

  const getDropzoneClassName = () => {
    const classes = [
      classNames.dropzone,
      ...(disabled ? [classNames.disabled] : []),
    ];
    if (isDragAccept) {
      classes.push(classNames.dropzoneAccept);
    } else if (isDragReject) {
      classes.push(classNames.dropzoneReject);
    }
    return classes.join(' ');
  };

  const dropzoneClassName = getDropzoneClassName();

  useImperativeHandle(ref, () => ({
    open,
  }));

  return (
    <div className={classNames.main}>
      {!elementOnly && label && (
        <InputLabel
          appearance={appearance}
          label={label}
          help={help}
          labelValues={labelValues}
          helpValues={helpValues}
          extra={extra}
        />
      )}
      <div
        className={dropzoneClassName}
        {...getRootProps()}
        data-test={dataTest}
      >
        <input {...getInputProps()} />
        {maxFileLimitNotMet && renderPlaceholder}
        {files.length > 0 && (
          <div className={classNames.filesContainer}>
            {files.map(({ file }, idx) => (
              <FileUploaderItem
                accept={accept}
                error={error?.message}
                key={`${file.name}-${file.size}`}
                idx={idx}
                maxFileSize={maxSize}
                name={name}
                upload={upload}
                handleError={handleError}
                processingData={processingData}
                handleProcessingData={handleProcessingData}
              />
            ))}
          </div>
        )}
        {renderExtraChildren()}
      </div>
      {!hideStatus && (
        <InputStatus
          appearance={appearance}
          status={status}
          statusValues={statusValues}
          error={error ? customErrorMessage || MSG.labelError : ''}
        />
      )}
    </div>
  );
};

FileUpload.displayName = displayName;

export default withForwardingRef(FileUpload) as ComponentType<FileUploadProps>;
