import { CheckCircle, CloudArrowUp, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import ProgressBar from '~v5/shared/ProgressBar/index.ts';

import { type ProgressContentProps } from '../types.ts';

const displayName = 'v5.common.AvatarUploader.partials.ProgressContent';

const ProgressContent: FC<ProgressContentProps> = ({
  progress,
  handleFileRemove,
  fileName,
  fileSize,
}) => {
  const isUploadCompleted = progress === 100;

  return (
    <div
      className={clsx(
        'flex w-full gap-3 rounded border bg-base-white px-6 py-4',
        {
          'border-blue-400': isUploadCompleted,
        },
      )}
    >
      <div className="mb-2 w-10">
        <div className="flex h-9 w-9 items-start justify-center rounded-full bg-blue-100 p-[0.25rem]">
          <div
            className={`bg-blue-light-100 flex
            h-7 w-7 items-start justify-center rounded-full p-[0.25rem] text-blue-400`}
          >
            <CloudArrowUp size={18} />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full items-center justify-between">
          <span className="text-gray-900 text-1">{fileName}</span>
          <div className="flex flex-col">
            {isUploadCompleted ? (
              <span className="text-blue-400">
                <CheckCircle size={18} />
              </span>
            ) : (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="flex text-gray-400"
                  onClick={handleFileRemove}
                >
                  <Trash size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
        <span className="text-sm text-gray-600">{fileSize}</span>
        <ProgressBar progress={progress} progressLabel={`${progress}%`} />
      </div>
    </div>
  );
};

ProgressContent.displayName = displayName;

export default ProgressContent;
