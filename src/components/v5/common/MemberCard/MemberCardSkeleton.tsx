import { DotsThree } from '@phosphor-icons/react';
import React from 'react';

const displayName = 'v5.common.MemberCardSkeleton';

export const MemberCardSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-gray-25 p-5">
      <div className="relative flex w-full flex-col items-center justify-center">
        <div className="absolute right-0 top-0 text-gray-400">
          <DotsThree size={16} className="gray-300 rotate-90" />
        </div>
        <div className="mb-5 h-[60px] w-[60px] overflow-hidden rounded-full bg-gray-300 skeleton" />
        <div className="h-[20px] w-3/5 overflow-hidden rounded bg-gray-300 skeleton" />
      </div>
      <div className="my-2.5 flex w-full items-center justify-between gap-4 border-t border-t-gray-200 py-px" />
      <div className="flex w-full items-center justify-between gap-4">
        <div className="h-[20px] w-1/5 overflow-hidden rounded bg-gray-300 skeleton" />
        <div className="h-[20px] w-2/6 overflow-hidden rounded-full bg-gray-300 skeleton" />
      </div>
    </div>
  );
};

MemberCardSkeleton.displayName = displayName;

export default MemberCardSkeleton;
