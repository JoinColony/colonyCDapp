import clsx from 'clsx';
import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { tw } from '~utils/css/index.ts';

const absoluteCenteredClass = tw`absolute left-1/2 top-1/2 z-base -translate-x-1/2 -translate-y-1/2`;

export const ChartLoadingLayer = () => {
  return (
    <div className={absoluteCenteredClass}>
      <div className="relative overflow-hidden rounded-full bg-transparent">
        <LoadingSkeleton
          className="h-[138px] w-[138px] rounded-full"
          isLoading
        />
        <div
          className={clsx(
            absoluteCenteredClass,
            'h-[102px] w-[102px] rounded-full bg-base-white',
          )}
        />
      </div>
    </div>
  );
};
