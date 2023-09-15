import React, { FC } from 'react';

import clsx from 'clsx';
import { ProgressBarProps } from './types';

const ProgressBar: FC<ProgressBarProps> = ({
  progress,
  isTall,
  additionalText,
}) => (
  <div className="flex items-center">
    <div
      className={clsx('relative w-full rounded bg-gray-200', {
        'h-2.5 rounded-lg': isTall,
        'h-2 rounded': !isTall,
      })}
    >
      <span
        className={clsx('bg-blue-400 h-full absolute left-0 top-0', {
          'rounded-lg': isTall,
          rounded: !isTall,
        })}
        style={{ width: `${progress}%` }}
      />
    </div>
    <span className="text-3 text-gray-600 ml-3">{progress || 0}%</span>
    {additionalText && (
      <span className="text-3 text-gray-600 ml-1">{additionalText}</span>
    )}
  </div>
);

export default ProgressBar;
