import { FieldArrayRenderProps } from 'formik';
import {
  Accept,
  DropzoneOptions,
  DropzoneProps,
  DropzoneState,
  FileRejection,
} from 'react-dropzone';
import { ComponentType, ReactNode, Ref } from 'react';
import {
  CoreInputProps,
  InputComponentAppearance as Appearance,
} from '~shared/Fields';
import { Message } from '~types';
import { FileReaderFile } from '~utils/fileReader/types';

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
  handleError?: (...args: any[]) => Promise<any>;
  processingData?: boolean;
  handleProcessingData?: (...args: any) => void;
}

export interface HookFormUploadItemComponentProps {
  accept: Accept;
  error?: string;
  key: string;
  idx: number;
  maxFileSize: number;
  name: string;
  upload: UploadFn;
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
  itemComponent?: ComponentType<HookFormUploadItemComponentProps>;
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

export type HandleFileAccept = (file: FileReaderFile) => void;

export interface SingleFileUploadProps {
  /** A child element to be displayed when dragging a file into the loader, e.g. an overlay */
  children?: React.ReactNode;
  /** Label for automated tests */
  dataTest?: CoreInputProps['dataTest'];
  /** Custom classNames for different states of the dropzone */
  dropzoneRootStyles?: {
    dropzone: string;
    dropzoneAccept?: string;
    dropzoneReject?: string;
  };
  /** Options for the dropzone provider */
  dropzoneOptions: DropzoneOptions;
  /** The component around which the file uploader is wrapped. The component the user will see. */
  placeholder: ReactNode;
  /** Ref for programmatic opening */
  ref?: Ref<any>;
  /** Called when user's input validates successfully */
  handleFileAccept: HandleFileAccept;
  /** Called when user's input validates unsuccessfully */
  handleFileReject?: DropzoneProps['onDropRejected'];
}
