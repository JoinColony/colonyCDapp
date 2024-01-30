import clsx from 'clsx';
import React, { type FC } from 'react';

import { type ProgressBarProps } from './types.ts';

const ProgressBar: FC<ProgressBarProps> = ({
  progress,
  isTall,
  additionalText,
  threshold = null,
  max = 100,
  barClassName,
  className,
}) => {
  if (progress > max || progress < 0) {
    throw new Error(`Progress bar value must be between between 0 and ${max}`);
  }

  return (
    <div className="flex items-center">
      <div
        className={clsx('relative w-full rounded bg-gray-200', {
          'h-2.5 rounded-lg': isTall,
          'h-2 rounded': !isTall,
        })}
      >
        <span
          className={clsx(
            barClassName,
            'bg-blue-400 h-full absolute left-0 top-0',
            {
              'rounded-lg': isTall,
              rounded: !isTall,
            },
          )}
          style={{ width: `${(progress / max) * 100}%` }}
        />
        {threshold !== null && threshold !== 0 && progress < threshold && (
          <span
            className="w-[.125rem] h-full bg-gray-400 absolute top-0"
            style={{ left: `${threshold}%` }}
          />
        )}
      </div>
      <span className="text-xs font-medium text-gray-600 ml-3 leading-3">
        {progress}
      </span>
      {additionalText && (
        <span className={clsx(className, 'text-3 text-gray-600 flex-shrink-0')}>
          {additionalText}
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
