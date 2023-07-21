import { Ref } from 'react';
import {
  DropEvent,
  DropzoneInputProps,
  DropzoneOptions,
  FileRejection,
} from 'react-dropzone';
import { MessageDescriptor } from 'react-intl';

import { DropzoneErrors } from '~shared/AvatarUploader/helpers';
import { HandleFileAccept } from '~shared/FileUpload/types';
import { UserFragment } from '~gql';

export type LeftColumnProps = {
  fieldTitle: MessageDescriptor;
  fieldDecription: MessageDescriptor;
};

export type UserProfileFormProps = {
  email?: string | null;
  bio?: string | null;
  username?: string | null;
  displayName?: string | null;
  location?: string | null;
  website?: string | null;
};

export type SuccessContentProps = Pick<
  ErrorContentProps,
  'open' | 'handleFileRemove'
>;

export type ErrorContentProps = Pick<
  AvatarUploaderProps,
  'handleFileRemove'
> & {
  errorCode: DropzoneErrors;
  fileRejections?: string;
  open: () => void;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
};

export type FileUploadProps = Pick<
  AvatarUploaderProps,
  'handleFileAccept' | 'handleFileReject' | 'handleFileRemove' | 'errorCode'
> & {
  dropzoneOptions: DropzoneOptions;
  forwardedRef: Ref<unknown> | undefined;
  placeholder: React.ReactNode;
  isAvatarUploaded: boolean;
};

export type AvatarUploaderProps = {
  avatarPlaceholder: React.ReactElement;
  errorCode?: DropzoneErrors;
  handleFileAccept: HandleFileAccept;
  handleFileReject?: (
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => void;
  handleFileRemove?: (...args: unknown[]) => Promise<unknown>;
  isLoading?: boolean;
  disabled?: boolean;
  user?: UserFragment | null;
};
