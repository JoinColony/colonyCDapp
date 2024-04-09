import {
  type DropEvent,
  type DropzoneInputProps,
  type DropzoneOptions,
  type FileRejection,
} from 'react-dropzone';

import { type FileReaderFile } from '~utils/fileReader/types.ts';

import { type DropzoneErrors } from './utils.ts';

export type SuccessContentProps = Pick<
  ErrorContentProps,
  'open' | 'handleFileRemove'
>;

export type HandleFileAccept = (file: FileReaderFile) => void;

export interface ErrorContentProps
  extends Pick<FileUploadProps, 'handleFileRemove' | 'errorCode'> {
  fileRejections?: string;
  open: () => void;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
}

export interface FileUploadOptions {
  fileFormat: string[];
  fileSize: string;
  fileDimension: string;
}

export interface FileUploadProps {
  dropzoneOptions: DropzoneOptions;
  isAvatarUploaded: boolean;
  errorCode?: DropzoneErrors;
  handleFileAccept: HandleFileAccept;
  handleFileReject?: (
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => void;
  handleFileRemove?: (...args: unknown[]) => Promise<unknown>;
  isProgressContentVisible?: boolean;
  isSimplified?: boolean;
  fileOptions: FileUploadOptions;
  SuccessComponent?: React.FC<SuccessContentProps>;
}

export interface AvatarUploaderProps {
  avatarPlaceholder: React.ReactElement;
  avatarSrc?: string;
  disabled?: boolean;
  fileOptions: FileUploadOptions;
  SuccessComponent?: React.FC<SuccessContentProps>;
  uploaderText?: string;
}

export interface DefaultContentProps extends Pick<ErrorContentProps, 'open'> {
  isSimplified?: boolean;
  isDragAccept: boolean;
  fileOptions: FileUploadOptions;
}

export interface ProgressContentProps {
  progress: number;
  handleFileRemove: (...args: unknown[]) => Promise<unknown>;
  fileName: string;
  fileSize: string;
}
