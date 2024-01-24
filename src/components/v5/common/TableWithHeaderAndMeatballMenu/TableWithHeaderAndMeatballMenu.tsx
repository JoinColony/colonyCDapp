import React, { type PropsWithChildren } from 'react';

import EmptyContent from '~v5/common/EmptyContent/index.ts';
import TableHeader from '~v5/common/TableHeader/index.ts';

import Table from '../Table/index.ts';

import { type TableWithHeaderAndMeatballMenuProps } from './types.ts';

const displayName = 'v5.common.TableWithHeaderAndMeatballMenu';

const TableWithHeaderAndMeatballMenu = <T,>({
  title,
  headerClassName,
  additionalHeaderContent,
  children,
  ...rest
}: PropsWithChildren<TableWithHeaderAndMeatballMenuProps<T>>) => (
  <>
    <TableHeader
      title={title}
      headerClassName={headerClassName}
      additionalHeaderContent={additionalHeaderContent}
    >
      {children}
    </TableHeader>
    {rest.data?.length ? (
      <Table {...rest} />
    ) : (
      <div className="border w-full rounded-b-lg border-gray-200">
        <EmptyContent
          icon="binoculars"
          title={{ id: 'balancePage.table.emptyTitle' }}
          description={{ id: 'balancePage.table.emptyDescription' }}
        />
      </div>
    )}
  </>
);

TableWithHeaderAndMeatballMenu.displayName = displayName;

export default TableWithHeaderAndMeatballMenu;
