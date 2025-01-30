import { CloudArrowUp, Trash } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { TextButton } from '~v5/shared/Button/index.ts';

import {
  type ErrorContentProps,
  type FileUploadMessageValues,
} from '../types.ts';
import { DropzoneErrors, getErrorMessage } from '../utils.ts';

const displayName = 'v5.common.AvatarUploader.partials.ErrorContent';

const ErrorContent: FC<ErrorContentProps> = ({
  errorCode,
  handleFileRemove,
  open,
  processedFile,
  fileOptions,
}) => {
  const { formatMessage } = useIntl();

  const errorMessage = getErrorMessage(errorCode || DropzoneErrors.DEFAULT);

  return (
    <div
      data-testid="avatar-uploader-error-content"
      className="flex w-full gap-3 rounded border border-negative-400 bg-base-white px-6 py-4"
    >
      <div className="mb-2 w-10">
        <div className="flex items-start justify-center rounded-full bg-negative-100 p-[0.25rem]">
          <div className="flex items-start justify-center rounded-full bg-negative-200 p-[0.25rem] text-negative-400">
            <CloudArrowUp size={18} />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="items-top flex justify-between gap-2">
          <span className=" text-left text-negative-400 text-1">
            {formatMessage(
              errorMessage,
              fileOptions as FileUploadMessageValues,
            )}
          </span>
          <button
            type="button"
            className="flex pt-[1px] text-negative-400 hover:text-blue-400"
            data-testid="file-remove"
            onClick={handleFileRemove}
          >
            <Trash size={18} />
          </button>
        </div>
        <span className="break-all text-left text-sm text-gray-600">
          {processedFile}
        </span>
        <TextButton
          onClick={open}
          isErrorColor
          className="text-sm font-semibold underline"
        >
          {formatMessage({ id: 'button.try.again' })}
        </TextButton>
      </div>
    </div>
  );
};

ErrorContent.displayName = displayName;

export default ErrorContent;
