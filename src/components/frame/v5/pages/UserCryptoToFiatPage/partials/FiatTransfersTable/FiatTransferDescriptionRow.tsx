import clsx from 'clsx';
import React, { type PropsWithChildren, type FC } from 'react';

interface FiatTransferDescriptionRowProps {
  title: string;
  loading: boolean;
}

export const FiatTransferDescriptionRow: FC<
  PropsWithChildren<FiatTransferDescriptionRowProps>
> = ({ title, children, loading }) => {
  const textClassName = 'font-normal text-sm flex items-center';
  return (
    <p
      className={clsx(textClassName, 'text-gray-600', {
        skeleton: loading,
      })}
    >
      <span>{title}:</span>
      <span className="ml-1">{children}</span>
    </p>
  );
};
