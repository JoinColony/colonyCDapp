import React, { type FC, type PropsWithChildren } from 'react';

interface EmptyContentWrapperProps extends PropsWithChildren {
  colSpan: number;
}

export const EmptyContentWrapper: FC<EmptyContentWrapperProps> = ({
  colSpan,
  children,
}) => {
  return (
    <tr className="[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100">
      <td colSpan={colSpan} className="h-full">
        <div className="flex flex-col items-start justify-center px-[1.1rem] py-4 text-md text-gray-500">
          {children}
        </div>
      </td>
    </tr>
  );
};
