import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';

import { TableHeaderProps } from './types';

const TableHeader: FC<PropsWithChildren<TableHeaderProps>> = ({
  title,
  additionalContent,
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        className,
        'py-5 px-4 border border-b-0 border-gray-200 rounded-t-lg',
      )}
    >
      <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col">
        <div className="flex items-center">
          <h4 className="heading-5 mr-3">{title}</h4>
          {additionalContent}
        </div>
        <div className="flex items-center mt-2.5 sm:mt-0">{children}</div>
      </div>
    </div>
  );
};

export default TableHeader;
