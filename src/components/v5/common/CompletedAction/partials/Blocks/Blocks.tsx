import React, { type PropsWithChildren } from 'react';

export const ActionTitle = ({
  children,
}: PropsWithChildren<Record<never, any>>) => {
  return (
    <h3 className="mb-2 line-clamp-4 break-words text-2xl font-bold text-gray-900">
      {children}
    </h3>
  );
};

export const ActionSubtitle = ({
  children,
}: PropsWithChildren<Record<never, any>>) => {
  return <div className="mb-7 whitespace-pre-wrap text-md">{children}</div>;
};

export const ActionDataGrid = ({
  children,
}: PropsWithChildren<Record<never, any>>) => {
  return (
    <div className="grid auto-rows-[minmax(1.875rem,auto)] grid-cols-[10rem_auto] items-center gap-y-3 text-md text-gray-900 sm:grid-cols-[12.5rem_auto]">
      {children}
    </div>
  );
};
