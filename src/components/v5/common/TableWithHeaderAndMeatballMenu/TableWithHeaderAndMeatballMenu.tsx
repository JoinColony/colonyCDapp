import React, { PropsWithChildren } from 'react';
import TableWithMeatballMenu from '../TableWithMeatballMenu';
import TableHeader from '~v5/common/TableHeader';
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
    <TableWithMeatballMenu {...rest} />
  </>
);

TableWithHeaderAndMeatballMenu.displayName = displayName;

export default TableWithHeaderAndMeatballMenu;
