import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';

export const ActionContentLoaderSkeleton = () => (
  <>
    <div className="mb-2">
      <LoadingSkeleton isLoading className="h-[1.875rem] w-[12.5rem] rounded" />
    </div>
    <div className="mb-7">
      <LoadingSkeleton isLoading className="h-5 w-[15.625rem] rounded" />
    </div>
    <div className="grid auto-rows-[minmax(1.875rem,auto)] grid-cols-[10rem_auto] items-center gap-y-3 text-md text-gray-900 sm:grid-cols-[12.5rem_auto]">
      <LoadingSkeleton isLoading className="h-5 w-[9.375rem] rounded" />
      <LoadingSkeleton isLoading className="h-5 w-[9.375rem] rounded" />
      <LoadingSkeleton isLoading className="h-5 w-[9.375rem] rounded" />
      <LoadingSkeleton isLoading className="h-5 w-[9.375rem] rounded" />
      <LoadingSkeleton isLoading className="h-5 w-[9.375rem] rounded" />
      <LoadingSkeleton isLoading className="h-5 w-[9.375rem] rounded" />
      <LoadingSkeleton isLoading className="h-5 w-[9.375rem] rounded" />
      <LoadingSkeleton isLoading className="h-5 w-[9.375rem] rounded" />
      <LoadingSkeleton isLoading className="h-5 w-[9.375rem] rounded" />
      <LoadingSkeleton isLoading className="h-5 w-[9.375rem] rounded" />
    </div>
  </>
);
