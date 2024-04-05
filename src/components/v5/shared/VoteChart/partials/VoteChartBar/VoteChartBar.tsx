import clsx from 'clsx';
import React, { type FC } from 'react';

import { VoteChartBarDirection, type VoteChartBarProps } from './types.ts';

const displayName = 'v5.VoteChart.partials.VoteChartBar';

const VoteChartBar: FC<VoteChartBarProps> = ({
  value,
  predictedValue,
  direction,
  barBackgroundClassName,
  predictionBarClassName,
}) => {
  return (
    <div
      className={clsx(
        `
          relative
          flex
          h-[1.875rem]
          w-full
          overflow-hidden
          bg-base-white
          after:absolute
          after:inset-0
          after:h-full
          after:w-full
          after:border
          after:border-gray-200
        `,
        {
          '-ml-[1px] rounded-r-3xl after:rounded-r-3xl':
            direction === VoteChartBarDirection.Right,
          '-mr-[1px] justify-end rounded-l-3xl after:rounded-l-3xl':
            direction === VoteChartBarDirection.Left,
        },
      )}
    >
      <span
        style={{
          width: `${value}%`,
        }}
        className={clsx(
          barBackgroundClassName,
          'relative -my-[1px] block h-[calc(100%+2px)] transition-[width]',
        )}
      />
      {predictedValue && (
        <span
          style={{
            width: `${predictedValue}%`,
          }}
          className={clsx(
            predictionBarClassName,
            'absolute bottom-0 top-0 block h-full border transition-all',
            {
              'left-0': direction === VoteChartBarDirection.Right,
              'right-0': direction === VoteChartBarDirection.Left,
              'rounded-r-3xl':
                direction === VoteChartBarDirection.Right &&
                predictedValue > 90,
              'rounded-l-3xl':
                direction === VoteChartBarDirection.Left && predictedValue > 90,
            },
          )}
        />
      )}
    </div>
  );
};

VoteChartBar.displayName = displayName;

export default VoteChartBar;
