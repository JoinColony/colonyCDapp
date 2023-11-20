import React, { FC, useState } from 'react';
import {
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { uniqueId } from 'lodash';
import Button from '~v5/shared/Button';
import { useColonyContext, useMobile } from '~hooks';
import { BalanceTableFieldModel, BalanceTableProps } from './types';
import { formatText } from '~utils/intl';
import { useSearchContext } from '~context/SearchContext';
import Filter from '~v5/common/Filter';
import { useBalanceTableColumns, useGetTableMenuProps } from './hooks';
import TableWithHeaderAndMeatballMenu from '~v5/common/TableWithHeaderAndMeatballMenu';

const displayName = 'v5.pages.BalancePage.partials.BalaceTable';

const BalanceTable: FC<BalanceTableProps> = ({ data }) => {
  const { colony } = useColonyContext();
  const { balances, nativeToken, status } = colony || {};
  const { nativeToken: nativeTokenStatus } = status || {};
  const onAddFunds = () => {}; // @TODO: open modal
  const isMobile = useMobile();
  const { searchValue } = useSearchContext();
  const [sorting, setSorting] = useState<SortingState>();
  const [rowSelection, setRowSelection] = useState({});
  const tokensDataLength = data?.length;

  const columns = useBalanceTableColumns(
    nativeToken,
    balances,
    nativeTokenStatus,
  );
  const getMenuProps = useGetTableMenuProps();

  return (
    <TableWithHeaderAndMeatballMenu<BalanceTableFieldModel>
      title={formatText({ id: 'balancePage.table.title' })}
      className="[&_td]:border-b [&_td]:border-gray-100 [&_th]:border-b [&_tr:last-child>td]:border-0 [&_td]:py-0 [&_td]:h-[3.75rem] [&_th:nth-last-child(2)]:text-right [&_td:nth-last-child(2)]:text-right"
      verticalOnMobile={false}
      hasPagination
      getRowId={({ token }) => (token ? token.tokenAddress : uniqueId())}
      columns={columns}
      data={data || []}
      state={{
        sorting,
        rowSelection,
        columnVisibility: {
          symbol: !isMobile,
          type: !isMobile,
        },
      }}
      enableSortingRemoval={false}
      sortDescFirst={false}
      initialState={{
        pagination: {
          pageSize: 10,
        },
      }}
      onSortingChange={setSorting}
      onRowSelectionChange={setRowSelection}
      getSortedRowModel={getSortedRowModel()}
      getPaginationRowModel={getPaginationRowModel()}
      getMenuProps={getMenuProps}
    >
      <>
        {(!!tokensDataLength || !!searchValue) && <Filter />}
        <Button
          mode="primarySolid"
          className="ml-2"
          onClick={onAddFunds}
          size="small"
        >
          {formatText({ id: 'balancePage.table.addFunds' })}
        </Button>
      </>
    </TableWithHeaderAndMeatballMenu>
  );
};

BalanceTable.displayName = displayName;

export default BalanceTable;
