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
import Table from '~v5/common/Table/index.ts';
import Button from '~v5/shared/Button/index.ts';

import { useVerifiedTableColumns } from './hooks.tsx';
import { type TableProps } from './types.ts';

const displayName = 'v5.pages.VerifiedPage.partials.VerifiedTable';

const VerifiedTable: FC<TableProps> = ({ list }) => {
  // @TODO: Add action for adding new member, removing user from whitelist, handle pagination
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
    <Table<ColonyContributorFragment>
      title={formatText({ id: 'verifiedPage.membersTitle' })}
      additionalHeaderContent={
        <span className="text-sm text-blue-400">
          {listLength} {formatMessage({ id: 'verifiedPage.members' })}
        </span>
      }
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
      className="w-full"
      verticalOnMobile={false}
      hasPagination
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
      enableSortingRemoval={false}
      enableSorting
      sortDescFirst={false}
      sizeUnit="px"
      renderCellWrapper={(classNames, content) => (
        <div className={clsx(classNames, 'py-3.5')}>{content}</div>
      )}
      tableHeaderChildren={
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
        </>
      }
    />
  );
};

VerifiedTable.displayName = displayName;

export default VerifiedTable;
