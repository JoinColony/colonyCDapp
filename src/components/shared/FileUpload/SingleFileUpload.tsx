import React, { ComponentType, useImperativeHandle } from 'react';
import classnames from 'classnames';

import { withForwardingRef, ForwardedRefProps } from '~utils/hoc';
import useDropzoneWithFileReader from '~hooks/useDropzoneWithFileReader';
import { SingleFileUploadProps } from './types';

import styles from './SingleFileUpload.css';

const displayName = 'SingleFileUpload';

const SingleFileUpload = ({
  children,
  dropzoneRootStyles: {
    dropzone,
    dropzoneAccept = styles.dropzoneAccept,
    dropzoneReject = styles.dropzoneReject,
  } = styles,
  dropzoneOptions,
  forwardedRef: ref,
  placeholder,
  handleFileAccept,
  handleFileReject,
  dataTest,
}: SingleFileUploadProps & ForwardedRefProps) => {
  const { getInputProps, getRootProps, open, isDragAccept, isDragReject } = useDropzoneWithFileReader({
    dropzoneOptions: {
      maxFiles: 1,
      ...dropzoneOptions,
    },
    handleFileAccept,
    handleFileReject,
  });

  // Allows parent to access the dropzone "open" method by passing down a ref.
  useImperativeHandle(ref, () => ({
    open,
  }));

  return (
    <div className={styles.main}>
      <div
        className={classnames(dropzone, {
          [dropzoneAccept]: isDragAccept,
          [dropzoneReject]: isDragReject,
        })}
        {...getRootProps({ 'aria-invalid': isDragReject })}
        data-test={dataTest}
      >
        <input {...getInputProps()} />
        {placeholder}
        {children}
      </div>
    </div>
  );
};

SingleFileUpload.displayName = displayName;

export default withForwardingRef(SingleFileUpload) as ComponentType<SingleFileUploadProps>;
