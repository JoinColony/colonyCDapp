import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import Table from '../Table/Table';
import { TableWithActionsHeaderProps } from './types';

const displayName = 'v5.common.TableWithActionsHeader';

const TableWithActionsHeader = <T,>({
  title,
  headerClassName,
  additionalHeaderContent,
  children,
  emptyContent,
  ...rest
}: PropsWithChildren<TableWithActionsHeaderProps<T>>) => (
  <>
    <div
      className={clsx(
        headerClassName,
        'py-5 px-4 border border-b-0 border-gray-200 rounded-t-lg',
      )}
    >
      <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col">
        <div className="flex items-center">
          <h4 className="heading-5 mr-3">{title}</h4>
          {additionalHeaderContent}
        </div>
        <div className="flex items-center mt-2.5 sm:mt-0">{children}</div>
      </div>
    </div>
    {emptyContent || <Table {...rest} />}
  </>
);

TableWithActionsHeader.displayName = displayName;

export default TableWithActionsHeader;
