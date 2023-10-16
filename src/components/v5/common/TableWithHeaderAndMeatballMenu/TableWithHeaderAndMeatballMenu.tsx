import React, { PropsWithChildren } from 'react';
import TableWithMeatballMenu from '../TableWithMeatballMenu';
import TableHeader from '~v5/common/TableHeader';
import EmptyContent from '~v5/common/EmptyContent';
import { TableWithHeaderAndMeatballMenuProps } from './types';

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
      <TableWithMeatballMenu {...rest} />
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
