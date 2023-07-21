import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import { DropzoneErrors } from '~shared/AvatarUploader/helpers';
import { TextButton } from '~v5/shared/Button';
import { ErrorContentProps } from '../types';
import styles from './AvatarUploader.module.css';

const displayName = 'v5.pages.UserProfilePage.partials.ErrorContent';

const ErrorContent: FC<ErrorContentProps> = ({
  errorCode,
  handleFileRemove,
  open,
  getInputProps,
  fileRejections,
}) => {
  const { formatMessage } = useIntl();

  const errorMessage =
    (errorCode === DropzoneErrors.TOO_LARGE && 'too.large.file.error') ||
    (errorCode === DropzoneErrors.CUSTOM && 'upload.failed') ||
    ((errorCode === DropzoneErrors.INVALID && 'invalid.type.error') as string);

  return (
    <div
      className={clsx(
        'gap-3 bg-base-white border-negative-400',
        styles.contentWrapper,
      )}
    >
      <div className="w-[2.55rem] mb-[0.5rem]">
        <div className="bg-negative-100 p-[0.4rem] rounded-full flex items-start justify-center">
          <div className="p-[0.3rem] bg-negative-200 rounded-full flex justify-center text-negative-400">
            <Icon name="cloud-arrow-up" appearance={{ size: 'small' }} />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full gap-1">
        <div className="flex justify-between items-center">
          <span className="text-negative-400 text-1">
            {formatMessage({ id: errorMessage })}
          </span>
          <button
            type="button"
            className="flex text-negative-400"
            onClick={handleFileRemove}
          >
            <Icon name="trash" appearance={{ size: 'small' }} />
          </button>
        </div>
        <span className="text-gray-600 text-sm">{fileRejections}</span>
        <TextButton onClick={open} mode="underlined" isErrorColor>
          {formatMessage({ id: 'button.try.again' })}
          <input {...getInputProps()} />
        </TextButton>
      </div>
    </div>
  );
};

ErrorContent.displayName = displayName;

export default ErrorContent;
