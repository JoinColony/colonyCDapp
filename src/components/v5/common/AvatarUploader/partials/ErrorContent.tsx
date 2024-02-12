import { CloudArrowUp, Trash } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { TextButton } from '~v5/shared/Button/index.ts';

import { type ErrorContentProps } from '../types.ts';
import { DropzoneErrors, getErrorMessage } from '../utils.tsx';

const displayName = 'v5.common.AvatarUploader.partials.ErrorContent';

const ErrorContent: FC<ErrorContentProps> = ({
  errorCode,
  handleFileRemove,
  open,
  getInputProps,
  fileRejections,
}) => {
  const { formatMessage } = useIntl();

  const errorMessage = getErrorMessage(errorCode || DropzoneErrors.DEFAULT);

  return (
    <div className="gap-3 bg-base-white border-negative-400 flex px-6 py-4 rounded border w-full">
      <div className="w-10 mb-2">
        <div className="bg-negative-100 p-[0.25rem] rounded-full flex items-start justify-center">
          <div className="bg-negative-200 text-negative-400 p-[0.25rem] rounded-full flex items-start justify-center">
            <CloudArrowUp size={18} />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full gap-1">
        <div className="flex justify-between items-center">
          <span className="text-negative-400 text-1">
            {formatMessage(errorMessage)}
          </span>
          <button
            type="button"
            className="flex text-negative-400"
            onClick={handleFileRemove}
          >
            <Trash size={18} />
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
