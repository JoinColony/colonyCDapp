import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/MenuWithStatusText.tsx';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';

export const WidgetContentLoaderSkeleton = () => (
  <MenuWithStatusText
    isLoading
    statusTextSectionProps={{ status: StatusTypes.Info }}
    sections={[
      {
        key: '1',
        content: (
          <div>
            <LoadingSkeleton
              isLoading
              className="h-[1.3125rem] w-[50%] rounded"
            />
            <div>
              <div className="mt-2 flex items-center gap-2">
                <LoadingSkeleton
                  isLoading
                  className="h-[1.4375rem] w-full rounded"
                />
                <LoadingSkeleton
                  isLoading
                  className="h-[1.4375rem] w-full rounded"
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <LoadingSkeleton
                  isLoading
                  className="h-[1.4375rem] w-full rounded"
                />
                <LoadingSkeleton
                  isLoading
                  className="h-[1.4375rem] w-full rounded"
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <LoadingSkeleton
                  isLoading
                  className="h-[1.4375rem] w-full rounded"
                />
                <LoadingSkeleton
                  isLoading
                  className="h-[1.4375rem] w-full rounded"
                />
              </div>
            </div>
          </div>
        ),
      },
    ]}
  />
);
