import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import {
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import Filter from '~v5/common/Filter';
import Button from '~v5/shared/Button';
import { TableProps } from './types';
import EmptyContent from '~v5/common/EmptyContent';
import { useSearchContext } from '~context/SearchContext';
import { useVerifiedTableColumns } from './hooks';
import { useMobile } from '~hooks';
import { formatText } from '~utils/intl';
import TableWithActionsHeader from '~v5/common/TableWithActionsHeader';

const displayName = 'v5.pages.VerifiedPage.partials.VerifiedTable';

const VerifiedTable: FC<TableProps> = ({ list }) => {
  // @TODO: Add action for adding new member, removing user from whitelist, handle pagination
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { searchValue } = useSearchContext();

  const onAddClick = () => {};
  const columns = useVerifiedTableColumns();

  const listLength = list.length;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  return (
    <TableWithActionsHeader
      title={formatText({ id: 'verifiedPage.membersTitle' })}
      additionalHeaderContent={
        <span className="text-md text-blue-400">
          {listLength} {formatMessage({ id: 'verifiedPage.members' })}
        </span>
      }
      verticalOnMobile={false}
      hasPagination
      className="rounded-t-none"
      getRowId={({ contributorAddress }) => contributorAddress}
      columns={columns}
      data={list}
      state={{
        sorting,
        rowSelection,
        columnVisibility: {
          colonyReputationPercentage: !isMobile,
          status: !isMobile,
        },
      }}
      initialState={{
        pagination: {
          pageSize: 10,
        },
      }}
      onSortingChange={setSorting}
      onRowSelectionChange={setRowSelection}
      getSortedRowModel={getSortedRowModel()}
      getPaginationRowModel={getPaginationRowModel()}
      emptyContent={
        !listLength && (
          <div className="border border-1 w-full rounded-b-lg border-gray-200">
            <EmptyContent
              icon="binoculars"
              title={{ id: 'verifiedPage.table.emptyTitle' }}
              description={{ id: 'verifiedPage.table.emptyDescription' }}
              buttonText={{ id: 'button.addNewMember' }}
              onClick={onAddClick}
              withoutButtonIcon
            />
          </div>
        )
      }
    >
      <>
        {!!Object.keys(rowSelection).length && (
          <Button
            mode="quaternary"
            iconName="trash"
            size="small"
            className="mr-2"
          >
            {formatMessage({ id: 'button.removeMembers' })}
          </Button>
        )}
        {(!!listLength || !!searchValue) && <Filter />}
        <Button
          mode="primarySolid"
          className="ml-2"
          onClick={onAddClick}
          size="small"
        >
          {formatMessage({ id: 'button.addNewMember' })}
        </Button>
      </>
    </TableWithActionsHeader>
  );
};

VerifiedTable.displayName = displayName;

export default VerifiedTable;
