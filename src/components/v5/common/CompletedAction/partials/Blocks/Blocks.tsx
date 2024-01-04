import React, { PropsWithChildren } from 'react';

export const ActionTitle = ({
  children,
}: PropsWithChildren<Record<never, any>>) => {
  return <h3 className="heading-3 mb-2 text-gray-900">{children}</h3>;
};

export const ActionSubtitle = ({
  children,
}: PropsWithChildren<Record<never, any>>) => {
  return (
    <div className="mb-7 text-md flex whitespace-pre-wrap">{children}</div>
  );
};

export const ActionDataGrid = ({
  children,
}: PropsWithChildren<Record<never, any>>) => {
  return (
    <div className="grid grid-cols-[10rem_auto] sm:grid-cols-[12.5rem_auto] gap-y-3 text-md text-gray-900 items-center">
      {children}
    </div>
  );
};
