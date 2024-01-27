import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

import { TableHeaderProps } from './types.ts';

const displayName = 'v5.common.TableHeader';

const TableHeader = ({
  title,
  headerClassName,
  additionalHeaderContent,
  children,
}: PropsWithChildren<TableHeaderProps>) => (
  <div className={clsx(headerClassName, 'pb-[0.875rem]')}>
    <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col">
      <div className="flex items-center">
        <h4 className="heading-5 mr-3">{title}</h4>
        {additionalHeaderContent}
      </div>
      {children && (
        <div className="flex items-center mt-2.5 sm:mt-0">{children}</div>
      )}
    </div>
  </div>
);

TableHeader.displayName = displayName;

export default TableHeader;
