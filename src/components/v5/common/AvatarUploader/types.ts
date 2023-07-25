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

export type ErrorContentProps = Pick<
  FileUploadProps,
  'handleFileRemove' | 'errorCode'
> & {
  fileRejections?: string;
  open: () => void;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
};

export type FileUploadProps = {
  dropzoneOptions: DropzoneOptions;
  forwardedRef: Ref<unknown> | undefined;
  placeholder: React.ReactNode;
  isAvatarUploaded: boolean;
  errorCode?: DropzoneErrors;
  handleFileAccept: HandleFileAccept;
  handleFileReject?: (
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => void;
  handleFileRemove?: (...args: unknown[]) => Promise<unknown>;
};

export type AvatarUploaderProps = {
  avatarPlaceholder: React.ReactElement;
  disabled?: boolean;
};

export type DefaultContentProps = Pick<ErrorContentProps, 'open'>;
