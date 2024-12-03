import React from 'react';

const displayName = `v5.common.ActionSidebar.partials.ActionSidebarWidgetLoadingSkeleton`;

const ActionSidebarWidgetLoadingSkeleton = () => {
  return (
    <div className="relative flex flex-col gap-4">
      <div className="flex w-full items-center gap-4">
        <div className="flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-gray-100" />
        </div>
        <div className="h-6 w-14 overflow-hidden rounded-full skeleton" />
      </div>
      <div className="ml-[1.625rem] overflow-hidden rounded-lg border border-gray-200">
        <div className="flex w-full gap-2 border-b border-gray-200 bg-gray-50 p-4.5 py-3">
          <div className="h-4 w-4 overflow-hidden rounded skeleton" />
          <div className="h-4 w-52 overflow-hidden rounded skeleton" />
        </div>
        <div>
          <div className="flex flex-col gap-2 bg-base-white p-4.5">
            <div className="h-5 w-16 overflow-hidden rounded skeleton" />
            <div className="flex justify-between">
              <div className="h-5 w-12 overflow-hidden rounded skeleton" />
              <div className="flex gap-2">
                <div className="h-5 w-5 overflow-hidden rounded-full skeleton" />
                <div className="h-5 w-12 overflow-hidden rounded skeleton" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-5 w-16 overflow-hidden rounded skeleton" />
              <div className="h-6 w-16 overflow-hidden rounded-full skeleton" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-5 w-12 overflow-hidden rounded skeleton" />
              <div className="h-5 w-32 overflow-hidden rounded skeleton" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center gap-4">
        <div className="flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-gray-100" />
        </div>
        <div className="h-6 w-12 overflow-hidden rounded-full skeleton" />
      </div>
      <div className="flex w-full items-center gap-4">
        <div className="flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-gray-100" />
        </div>
        <div className="h-6 w-16 overflow-hidden rounded-full skeleton" />
      </div>
      <div className="flex w-full items-center gap-4">
        <div className="flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-gray-100" />
        </div>
        <div className="h-6 w-14 overflow-hidden rounded-full skeleton" />
      </div>
      <div className="absolute bottom-12 left-[4.5px] top-3 border-l-[1px] border-dashed border-l-gray-100" />
      <div className="absolute bottom-3 left-[4.5px] top-72 border-l-[1px] border-solid border-l-gray-100" />
    </div>
  );
};

ActionSidebarWidgetLoadingSkeleton.displayName = displayName;

export default ActionSidebarWidgetLoadingSkeleton;
