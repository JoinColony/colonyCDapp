import clsx from 'clsx';
import React, { FC } from 'react';

import { VOTE_CHART_BAR_DIRECTION, VoteChartBarProps } from './types';

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
          w-full
          h-[1.875rem]
          bg-base-white
          overflow-hidden
          flex
          after:absolute
          after:inset-0
          after:border
          after:border-gray-200
          after:h-full
          after:w-full
        `,
        {
          'rounded-r-3xl after:rounded-r-3xl -ml-[1px]':
            direction === VOTE_CHART_BAR_DIRECTION.Right,
          'rounded-l-3xl after:rounded-l-3xl -mr-[1px] justify-end':
            direction === VOTE_CHART_BAR_DIRECTION.Left,
        },
      )}
    >
      <span
        style={{
          width: `${value}%`,
        }}
        className={clsx(
          barBackgroundClassName,
          'h-[calc(100%+2px)] -my-[1px] block transition-[width] relative z-[2]',
        )}
      />
      {predictedValue && (
        <span
          style={{
            width: `${predictedValue}%`,
          }}
          className={clsx(
            predictionBarClassName,
            'absolute top-0 bottom-0 border h-full block transition-all z-[1]',
            {
              'left-0': direction === VOTE_CHART_BAR_DIRECTION.Right,
              'right-0': direction === VOTE_CHART_BAR_DIRECTION.Left,
              'rounded-r-3xl':
                direction === VOTE_CHART_BAR_DIRECTION.Right &&
                predictedValue > 90,
              'rounded-l-3xl':
                direction === VOTE_CHART_BAR_DIRECTION.Left &&
                predictedValue > 90,
            },
          )}
        />
      )}
    </div>
  );
};

VoteChartBar.displayName = displayName;

export default VoteChartBar;
