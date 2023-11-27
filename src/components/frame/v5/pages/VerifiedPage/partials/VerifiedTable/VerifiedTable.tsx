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
import { useVerifiedTableColumns } from './hooks';
import { useMobile } from '~hooks';
import { formatText } from '~utils/intl';
import TableWithActionsHeader from '~v5/common/TableWithActionsHeader';
import { ColonyContributorFragment } from '~gql';

const displayName = 'v5.pages.VerifiedPage.partials.VerifiedTable';

const VerifiedTable: FC<TableProps> = ({ list }) => {
  // @TODO: Add action for adding new member, removing user from whitelist, handle pagination
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const onAddClick = () => {};
  const columns = useVerifiedTableColumns();

  const listLength = list.length;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  return (
    <TableWithActionsHeader<ColonyContributorFragment>
      title={formatText({ id: 'verifiedPage.membersTitle' })}
      additionalHeaderContent={
        <span className="text-md text-blue-400">
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
      tableProps={{
        className: 'w-full',
        verticalOnMobile: false,
        hasPagination: true,
        getRowId: ({ contributorAddress }) => contributorAddress,
        columns,
        data: list,
        state: {
          sorting,
          rowSelection,
          columnVisibility: {
            colonyReputationPercentage: !isMobile,
            status: !isMobile,
          },
        },
        initialState: {
          pagination: {
            pageSize: 10,
          },
        },
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      }}
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
        <Filter customLabel={formatMessage({ id: 'allFilters' })} />
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
