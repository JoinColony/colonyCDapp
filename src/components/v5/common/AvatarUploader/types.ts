import { Ref } from 'react';
import {
  DropEvent,
  DropzoneInputProps,
  DropzoneOptions,
  FileRejection,
} from 'react-dropzone';

import { DropzoneErrors } from '~shared/AvatarUploader/helpers';
import { HandleFileAccept } from '~shared/FileUpload/types';

export type SuccessContentProps = Pick<
  ErrorContentProps,
  'open' | 'handleFileRemove'
>;

export interface ErrorContentProps
  extends Pick<
    FileUploadProps,
    'handleFileRemove' | 'errorCode' | 'fileOptions' | 'fileUploadErrorMessages'
  > {
  fileRejections?: string;
  open: () => void;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
}

export interface FileUploadOptions {
  fileFormat: string[];
  fileSize: string;
  fileDimension?: string;
  filEntriesNumber?: number;
}

export type FileUploadErrorMessageTypes = {
  invalidFileFormat?: string;
  tooLargeFile?: string;
  exceedsNumberFile?: string;
};

export interface FileUploadProps {
  dropzoneOptions: DropzoneOptions;
  forwardedRef: Ref<unknown> | undefined;
  isAvatarUploaded: boolean;
  errorCode?: DropzoneErrors;
  handleFileAccept: HandleFileAccept;
  handleFileReject?: (
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => void;
  handleFileRemove?: (...args: unknown[]) => Promise<unknown>;
  isPropgressContentVisible?: boolean;
  isSimplified?: boolean;
  fileOptions: FileUploadOptions;
  fileUploadErrorMessages?: FileUploadErrorMessageTypes;
}

export interface AvatarUploaderProps {
  avatarPlaceholder: React.ReactElement;
  disabled?: boolean;
  fileOptions: FileUploadOptions;
}

export interface DefaultContentProps extends Pick<ErrorContentProps, 'open'> {
  isSimplified?: boolean;
  fileOptions: FileUploadOptions;
}

export interface ProgressContentProps {
  progress: number;
  handleFileRemove: (...args: unknown[]) => Promise<unknown>;
  fileName: string;
  fileSize: string;
}
