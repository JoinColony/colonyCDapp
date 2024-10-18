import React, { type FC, type PropsWithChildren } from 'react';

interface GroupedActionWrapperProps {
  title: string;
  description: string;
}

export const GroupedActionWrapper: FC<
  PropsWithChildren<GroupedActionWrapperProps>
> = ({ title, description, children }) => {
  return (
    <div className="overflow-auto px-6 py-8 pr-8">
      <h2 className="pb-2 heading-3">{title}</h2>
      <p className="pb-8 text-md text-gray-600">{description}</p>
      {children}
    </div>
  );
};
