import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import { DropzoneErrors } from '~shared/AvatarUploader/helpers';
import { TextButton } from '~v5/shared/Button';
import styles from './AvatarUploader.module.css';
import { ErrorContentProps } from '../types';

const displayName = 'v5.common.AvatarUploader.partials.ErrorContent';

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
      <div className={styles.iconWrapper}>
        <div className={`bg-negative-100 ${styles.iconCircle}`}>
          <div
            className={`bg-negative-200 text-negative-400 ${styles.iconCircle}`}
          >
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
