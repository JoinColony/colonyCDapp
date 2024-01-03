import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

import Table from '../Table/Table';
import { TableProps } from '../Table/types';

import { TableWithActionsHeaderProps } from './types';

const displayName = 'v5.common.TableWithActionsHeader';

function TableWithActionsHeader<
  TData,
  TProps extends TableProps<TData> = TableProps<TData>,
>({
  title,
  headerClassName,
  additionalHeaderContent,
  children,
  emptyContent,
  tableProps,
  tableComponent: TableComponent = Table,
}: PropsWithChildren<TableWithActionsHeaderProps<TData, TProps>>) {
  return (
    <>
      <div className={clsx(headerClassName, 'pb-3.5')}>
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
      {emptyContent || <TableComponent {...tableProps} />}
    </>
  );
}

TableWithActionsHeader.displayName = displayName;

export default TableWithActionsHeader;
