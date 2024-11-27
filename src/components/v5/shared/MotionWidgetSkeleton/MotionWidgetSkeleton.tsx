import React from 'react';

const displayName = 'v5.shared.MotionWidgetSkeleton';

const MotionWidgetSkeleton = () => {
  return (
    <div className="h-[11.25rem] w-full overflow-hidden rounded-lg border border-gray-200">
      <div className="w-full border-b border-gray-200 bg-gray-50 p-[1.125rem] py-3">
        <div className="h-3 w-3/4 skeleton" />
      </div>
      <div>
        <div className="gap-4 p-[1.125rem]">
          <div className="mb-4 h-3 w-4/5 skeleton" />
          <div className="mb-4 h-3 w-3/4 skeleton" />
          <div className="mb-4 h-3 w-3/4 skeleton" />
          <div className="h-3 w-3/4 skeleton" />
        </div>
      </div>
    </div>
  );
};

MotionWidgetSkeleton.displayName = displayName;
export default MotionWidgetSkeleton;
