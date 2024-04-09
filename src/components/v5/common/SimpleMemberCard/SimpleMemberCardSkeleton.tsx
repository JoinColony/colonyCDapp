import React from 'react';

const displayName = 'v5.common.SimpleMemberCardSkeleton';

export const SimpleMemberCardSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-gray-25 p-5">
      <div className="flex items-center gap-2.5">
        <div className="h-[1.875rem] w-[1.875rem] overflow-hidden rounded-full bg-gray-300 skeleton" />
        <div className="h-4 w-2/3 overflow-hidden rounded bg-gray-300 skeleton" />
      </div>
    </div>
  );
};

SimpleMemberCardSkeleton.displayName = displayName;

export default SimpleMemberCardSkeleton;
