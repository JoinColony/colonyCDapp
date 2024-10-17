import React, { type PropsWithChildren } from 'react';

import { type TableHeaderProps } from './types.ts';

const displayName = 'v5.common.TableHeader';

const TableHeader = ({
  title,
  additionalHeaderContent,
  children,
}: PropsWithChildren<TableHeaderProps>) => (
  <div className="pb-3.5">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-shrink-0 items-center sm:min-h-8.5">
        <h4 className="mr-3 heading-5">{title}</h4>
        {additionalHeaderContent}
      </div>
      {children && (
        <div className="mt-2.5 flex items-center sm:mt-0">{children}</div>
      )}
    </div>
  </div>
);

TableHeader.displayName = displayName;

export default TableHeader;
