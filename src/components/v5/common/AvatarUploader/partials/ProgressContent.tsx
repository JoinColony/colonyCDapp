import clsx from 'clsx';
import React, { FC } from 'react';

import Icon from '~shared/Icon/index.ts';
import ProgressBar from '~v5/shared/ProgressBar/index.ts';

import { ProgressContentProps } from '../types.ts';

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
        'gap-3 bg-base-white flex px-6 py-4 rounded border w-full',
        {
          'border-blue-400': isUploadCompleted,
        },
      )}
    >
      <div className="w-10 mb-2">
        <div className="bg-blue-100 w-9 h-9 p-[0.25rem] rounded-full flex items-start justify-center">
          <div
            className={`bg-blue-light-100 text-blue-400 
            w-7 h-7 p-[0.25rem] rounded-full flex items-start justify-center`}
          >
            <Icon name="cloud-arrow-up" appearance={{ size: 'small' }} />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full gap-1">
        <div className="flex justify-between items-center w-full">
          <span className="text-gray-900 text-1">{fileName}</span>
          <div className="flex flex-col">
            {isUploadCompleted ? (
              <span className="text-blue-400">
                <Icon name="check-circle" appearance={{ size: 'small' }} />
              </span>
            ) : (
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  className="flex text-gray-400"
                  onClick={handleFileRemove}
                >
                  <Icon name="trash" appearance={{ size: 'tiny' }} />
                </button>
              </div>
            )}
          </div>
        </div>
        <span className="text-gray-600 text-sm">{fileSize}</span>
        <ProgressBar progress={progress} additionalText="%" />
      </div>
    </div>
  );
};

ProgressContent.displayName = displayName;

export default ProgressContent;
