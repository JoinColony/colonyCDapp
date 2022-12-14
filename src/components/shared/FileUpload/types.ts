import { FieldArrayRenderProps } from 'formik';
import { DropzoneOptions, DropzoneState, FileRejection } from 'react-dropzone';
import { ComponentType, ReactNode, Ref } from 'react';
import {
  CoreInputProps,
  InputComponentAppearance as Appearance,
} from '~shared/Fields';
import { Message } from '~types';

export interface FileReaderFile {
  name: string;
  type: string;
  size: number;
  lastModified: string;
  uploadDate: Date;
  data: string;
}

export interface UploadFile {
  file: File;
  uploaded?: string | boolean;
  error?: string;
  preview?: string;
  parsedData?: string[];
}

export interface UploadItemComponentProps {
  accept: { [key: string]: string[] };
  error?: string;
  key: string;
  idx: number;
  maxFileSize: number;
  name: string;
  remove: FieldArrayRenderProps['remove'];
  reset: FieldArrayRenderProps['form']['resetForm'];
  upload: UploadFn;
  validate: ValidateFileFn;
  handleError?: (...args: any[]) => Promise<any>;
  processingData?: boolean;
  handleProcessingData?: (...args: any) => void;
}

export type UploadFn = (fileData: FileReaderFile | File | null) => any;

export type ValidateFileFn = (value: UploadFile) => string | undefined;

export interface AcceptedFile {
  file: File;
}

export interface UploadedFile extends AcceptedFile {
  preview: string;
  /** mutation result */
  uploaded: any;
}

export type UserFile = AcceptedFile | FileRejection | UploadedFile;

export interface FileUploadFormValues {
  [k: string]: UserFile[];
}

export interface FileUploadProps extends CoreInputProps {
  /** Appearance object for both label and status */
  appearance?: Appearance;
  /** Content to render inside the dropzone */
  children?: ReactNode | ((props: DropzoneState) => ReactNode);
  /** Custom classNames for different elements of the component */
  classNames?: {
    main?: string;
    dropzone?: string;
    dropzoneAccept?: string;
    dropzoneReject?: string;
    filesContainer?: string;
    disabled?: string;
  };
  /** Options for the dropzone provider */
  dropzoneOptions: DropzoneOptions;
  /** Hide the status component beneath the file uploader. Useful if you wish to display the status elsewhere, e.g. outside the component. */
  hideStatus?: boolean;
  /** The component to render each item to be uploaded */
  itemComponent?: ComponentType<UploadItemComponentProps>;
  /** Maximum number of files to accept */
  maxFilesLimit?: number;
  /** Max file size */
  maxSize?: number;
  /** Placeholder element for when no files have been picked yet (renderProp) */
  renderPlaceholder?: ReactNode | null;
  /** Ref for programmatic opening */
  ref?: Ref<any>;
  /** Function to handle the actual uploading of the file */
  upload: UploadFn;
  /** Function to handle an upload error from the outside */
  handleError?: (...args: any[]) => Promise<any>;

  customErrorMessage?: Message;

  processingData?: boolean;

  handleProcessingData?: (...args: any) => void;
}
