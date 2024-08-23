import {
  type DropEvent,
  type DropzoneOptions,
  type FileRejection,
} from 'react-dropzone';

import { type FileReaderFile } from '~utils/fileReader/types.ts';

import { type DropzoneErrors } from './utils.ts';

import type React from 'react';

export type SuccessContentProps = Pick<
  ErrorContentProps,
  'open' | 'handleFileRemove'
>;

export type HandleFileAccept = (file: FileReaderFile) => void;

export interface ErrorContentProps
  extends Pick<FileUploadProps, 'handleFileRemove' | 'errorCode'> {
  fileRejections?: string;
  open: () => void;
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
  showUploader?: boolean;
  setShowUploader?: React.Dispatch<React.SetStateAction<boolean>>;
  isAvatarAvailable?: boolean;
}

export interface AvatarUploaderProps {
  avatarPlaceholder: React.ReactElement;
  avatarSrc?: string;
  disabled?: boolean;
  fileOptions: FileUploadOptions;
  SuccessComponent?: React.FC<SuccessContentProps>;
  uploaderText?: string;
}

export interface DefaultContentProps
  extends Pick<ErrorContentProps, 'open'>,
    Pick<
      FileUploadProps,
      'handleFileRemove' | 'showUploader' | 'setShowUploader'
    > {
  isSimplified?: boolean;
  isDragAccept: boolean;
  fileOptions: FileUploadOptions;
  showRemoveAvatarButton?: boolean;
}

export interface ProgressContentProps {
  progress: number;
  handleFileRemove: (...args: unknown[]) => Promise<unknown>;
  fileName: string;
  fileSize: string;
}
