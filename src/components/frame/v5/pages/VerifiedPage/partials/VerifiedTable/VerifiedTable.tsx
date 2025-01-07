import { Binoculars, Trash } from '@phosphor-icons/react';
import {
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table';
import clsx from 'clsx';
import React, { type FC, useState } from 'react';
import { useIntl } from 'react-intl';

import { type ColonyContributorFragment } from '~gql';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import Filter from '~v5/common/Filter/index.ts';
import { Table } from '~v5/common/Table/Table.tsx';
import TableHeader from '~v5/common/TableHeader/TableHeader.tsx';
import Button from '~v5/shared/Button/index.ts';

import { useVerifiedTableColumns } from './hooks.tsx';
import { type TableProps } from './types.ts';

const displayName = 'v5.pages.VerifiedPage.partials.VerifiedTable';

const VerifiedTable: FC<TableProps> = ({ list }) => {
  // @TODO: Add action for adding new member, handle pagination
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const onAddClick = () => {};
  const columns = useVerifiedTableColumns();

  const listLength = list.length;
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'reputation',
      desc: true,
    },
  ]);
  const [rowSelection, setRowSelection] = useState({});

  return (
    <>
      <TableHeader
        title={formatText({ id: 'verifiedPage.membersTitle' })}
        additionalHeaderContent={
          <span className="text-sm text-blue-400">
            {listLength} {formatMessage({ id: 'verifiedPage.members' })}
          </span>
        }
      >
        {!!Object.keys(rowSelection).length && (
          <Button mode="quaternary" icon={Trash} size="small" className="mr-2">
            {formatMessage({ id: 'button.removeMembers' })}
          </Button>
        )}
        <Filter
          customLabel={formatMessage({ id: 'allFilters' })}
          searchInputLabel={formatMessage({
            id: 'filter.members.search.title',
          })}
          searchInputPlaceholder={formatMessage({
            id: 'filter.members.input.placeholder',
          })}
        />
        <Button
          mode="primarySolid"
          className="ml-2"
          onClick={onAddClick}
          size="small"
        >
          {formatMessage({ id: 'button.addNewMember' })}
        </Button>
      </TableHeader>
      <Table<ColonyContributorFragment>
        columns={columns}
        data={list}
        className={clsx('w-full', { 'pb-4': listLength > 10 })}
        emptyContent={
          !listLength && (
            <EmptyContent
              icon={Binoculars}
              title={{ id: 'verifiedPage.table.emptyTitle' }}
              description={{ id: 'verifiedPage.table.emptyDescription' }}
              buttonText={{ id: 'button.addNewMember' }}
              onClick={onAddClick}
              withoutButtonIcon
            />
          )
        }
        renderCellWrapper={(classNames, content) => (
          <div className={clsx(classNames, 'py-3.5')}>{content}</div>
        )}
        overrides={{
          getRowId: ({ contributorAddress }) => contributorAddress,
          state: {
            sorting,
            rowSelection,
            columnVisibility: {
              reputation: !isMobile,
              status: !isMobile,
            },
          },
          initialState: {
            pagination: {
              pageIndex: 0,
              pageSize: 10,
            },
          },
          onSortingChange: setSorting,
          onRowSelectionChange: setRowSelection,
          getSortedRowModel: getSortedRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
          enableSortingRemoval: false,
          enableSorting: true,
          sortDescFirst: false,
        }}
      />
    </>
  );
};

VerifiedTable.displayName = displayName;

export default VerifiedTable;
