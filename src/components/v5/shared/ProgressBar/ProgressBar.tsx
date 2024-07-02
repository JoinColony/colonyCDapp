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
    <div className="flex w-full items-center">
      <div
        className={clsx('relative w-full rounded bg-gray-200', {
          'h-2.5 rounded-lg': isTall,
          'h-2 rounded': !isTall,
        })}
      >
        <span
          className={clsx(
            barClassName,
            'absolute left-0 top-0 h-full bg-blue-400',
            {
              'rounded-lg': isTall,
              rounded: !isTall,
            },
          )}
          style={{ width: `${(progress / max) * 100}%` }}
        />
        {threshold !== null && threshold !== 0 && progress < threshold && (
          <span
            className="absolute top-0 h-full w-[.125rem] bg-gray-400"
            style={{ left: `${threshold}%` }}
          />
        )}
      </div>
      <span className="ml-3 text-xs font-medium leading-3 text-gray-600">
        {progress}
      </span>
      {additionalText && (
        <span className={clsx(className, 'flex-shrink-0 text-gray-600 text-3')}>
          {additionalText}
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
