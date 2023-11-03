import {
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import React, { FC } from 'react';
import { formatText } from '~utils/intl';
import TableWithActionsHeader from '~v5/common/TableWithActionsHeader';
import Button from '~v5/shared/Button';
import Filter from '../Filter';
import { useFundsTable, useFundsTableColumns } from './hooks';

const FundsTable: FC = () => {
  const columns = useFundsTableColumns();
  const { filters, visibleTokens } = useFundsTable();

  return (
    <TableWithActionsHeader
      title={formatText({ id: 'incomingFundsPage.table.title' })}
      data={visibleTokens}
      columns={columns}
      verticalOnMobile={false}
      hasPagination
      initialState={{
        pagination: {
          pageSize: 4,
        },
      }}
      getFilteredRowModel={getFilteredRowModel()}
      getPaginationRowModel={getPaginationRowModel()}
      className="[&_td]:border-b [&_td]:border-gray-100 [&_tr:last-child>td]:border-0 [&_td]:p-0 rounded-t-none w-full"
    >
      <div className="flex items-center gap-2">
        {/* <Button
          onClick={() => setNotApprovedVisible((prevState) => !prevState)}
        >
          ad
        </Button> */}
        <Filter {...filters} />
        <Button onClick={() => {}}>
          {formatText({ id: 'incomingFundsPage.table.claimAllFunds' })}
        </Button>
      </div>
    </TableWithActionsHeader>
  );
};

export default FundsTable;
