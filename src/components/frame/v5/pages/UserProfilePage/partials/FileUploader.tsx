import React, { ComponentType, useImperativeHandle } from 'react';
// import classnames from 'classnames';

import { withForwardingRef, ForwardedRefProps } from '~utils/hoc';
import useDropzoneWithFileReader from '~hooks/useDropzoneWithFileReader';
import { SingleFileUploadProps } from '~shared/FileUpload';
// import { SingleFileUploadProps } from './types';

// import styles from './SingleFileUpload.css';

const displayName = 'SingleFileUpload';

const FileUpload = ({
  children,
  //   dropzoneRootStyles: {
  //     dropzone,
  //     dropzoneAccept = styles.dropzoneAccept,
  //     dropzoneReject = styles.dropzoneReject,
  //   } = styles,
  dropzoneOptions,
  forwardedRef: ref,
  placeholder,
  handleFileAccept,
  handleFileReject,
  dataTest,
}: SingleFileUploadProps & ForwardedRefProps) => {
  const { getInputProps, getRootProps, open, isDragReject } =
    useDropzoneWithFileReader({
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
    <div>
      <div
        // className={classnames(dropzone, {
        //   [dropzoneAccept]: isDragAccept,
        //   [dropzoneReject]: isDragReject,
        // })}

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

FileUpload.displayName = displayName;

export default withForwardingRef(
  FileUpload,
) as ComponentType<SingleFileUploadProps>;
