import clsx from 'clsx';
import React, { type FC } from 'react';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';

import { type ProgressBarProps } from './types.ts';

const ProgressBar: FC<ProgressBarProps> = ({
  progress,
  progressLabel,
  isTall,
  threshold = null,
  max = 100,
  barClassName,
  className,
}) => {
  const { isDarkMode } = usePageThemeContext();
  if (progress > max || progress < 0) {
    throw new Error(`Progress bar value must be between between 0 and ${max}`);
  }

  return (
    <div className={clsx(className, 'flex items-center')}>
      <div
        className={clsx('relative w-full rounded', {
          'h-2.5 rounded-lg': isTall,
          'h-2 rounded': !isTall,
          'bg-gray-200': !isDarkMode,
          'bg-gray-300': isDarkMode,
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
      <span className="ml-3 flex-shrink-0 text-sm font-medium leading-3 text-gray-600">
        {progressLabel || progress}
      </span>
    </div>
  );
};

export default ProgressBar;
