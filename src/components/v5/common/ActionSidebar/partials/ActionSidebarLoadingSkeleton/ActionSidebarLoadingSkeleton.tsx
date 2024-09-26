import clsx from 'clsx';
import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/MenuWithStatusText.tsx';

export interface ActionSidebarLoadingSkeletonProps {
  isCreateActionSkeleton?: boolean;
}

const displayName = `v5.common.ActionSidebar.partials.ActionSidebarLoadingSkeleton`;

const ActionSidebarLoadingSkeleton = ({
  isCreateActionSkeleton = false,
}: ActionSidebarLoadingSkeletonProps) => {
  if (isCreateActionSkeleton) {
    return (
      <div className="px-6 pt-8">
        <LoadingSkeleton
          isLoading
          className="h-[1.875rem] w-[12.5rem] rounded"
        />
        <div className="mt-7 flex items-center gap-2">
          <LoadingSkeleton
            isLoading
            className="h-[1.875rem] w-[12.5rem] rounded"
          />
          <LoadingSkeleton
            isLoading
            className="h-[1.875rem] w-[12.5rem] rounded"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-grow flex-col-reverse justify-end overflow-auto sm:flex-row sm:justify-start">
      <div
        className={clsx(
          'w-full overflow-y-auto px-6 pb-6 pt-8 sm:w-[calc(100%-23.75rem)]',
        )}
      >
        <div className="mb-2">
          <LoadingSkeleton
            isLoading
            className="h-[1.875rem] w-[12.5rem] rounded"
          />
        </div>
        <div className="mb-7">
          <LoadingSkeleton isLoading className="h-5 w-[15.625rem] rounded" />
        </div>
        <div className="grid auto-rows-[minmax(1.875rem,auto)] grid-cols-[10rem_auto] items-center gap-y-3 text-md text-gray-900 sm:grid-cols-[12.5rem_auto]">
          {new Array(10).fill(0).map(() => (
            <LoadingSkeleton isLoading className="h-5 w-[9.375rem] rounded" />
          ))}
        </div>
      </div>

      <div
        className={`
              w-full
              border-b
              border-b-gray-200
              bg-gray-25
              px-6
              py-8
              sm:h-full
              sm:w-[23.75rem]
              sm:flex-shrink-0
              sm:overflow-y-auto
              sm:border-b-0
              sm:border-l
              sm:border-l-gray-200
            `}
      >
        <MenuWithStatusText
          statusText={
            <LoadingSkeleton isLoading className="h-4 w-full rounded" />
          }
          sections={[
            {
              key: '1',
              content: (
                <div>
                  <LoadingSkeleton
                    isLoading
                    className="h-[1.3125rem] w-1/2 rounded"
                  />
                  <div>
                    {new Array(3).fill(0).map(() => (
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
                    ))}
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

ActionSidebarLoadingSkeleton.displayName = displayName;

export default ActionSidebarLoadingSkeleton;
