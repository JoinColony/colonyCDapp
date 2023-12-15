import clsx from 'clsx';
import React, { FC } from 'react';

import { useActionSidebarContext } from '~context';
import { useMobile } from '~hooks';
import { ColonyAction } from '~types';
import { formatText } from '~utils/intl';
import { merge } from '~utils/lodash';
import EmptyContent from '~v5/common/EmptyContent';
import TableWithActionsHeader from '~v5/common/TableWithActionsHeader';
import TableWithMeatballMenu from '~v5/common/TableWithMeatballMenu';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';
import Filters from '~v5/shared/Filters';

import {
  useActionsTableData,
  useColonyActionsTableColumns,
  useColonyActionsTableFilters,
  useGetColonyActionsTableMenuProps,
  useRenderRowLink,
} from './hooks';
import { ColonyActionsTableProps } from './types';

const displayName = 'common.ColonyActionsTable';

const ColonyActionsTable: FC<ColonyActionsTableProps> = ({
  pageSize = 10,
  withHeader = true,
  className,
  additionalPaginationButtonsContent,
  ...rest
}) => {
  const {
    filters,
    setFilters,
    searchFilter,
    setSearchFilter,
    activityFeedFilters,
    filterItems,
  } = useColonyActionsTableFilters();
  const {
    data,
    loading,
    loadingMotionStates,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPrevPage,
    setSorting,
    sorting,
    refetchMotionStates,
    pageNumber,
  } = useActionsTableData(pageSize, activityFeedFilters);
  const columns = useColonyActionsTableColumns(
    loading,
    loadingMotionStates,
    refetchMotionStates,
  );
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();
  const getMenuProps = useGetColonyActionsTableMenuProps(loading);
  const isMobile = useMobile();
  const renderRowLink = useRenderRowLink(loading);
  const tableProps: TableWithMeatballMenuProps<ColonyAction> = merge(
    {
      className: clsx(className, {
        '[&_tr:hover]:bg-gray-25': data.length > 0 && !loading,
      }),
      enableSortingRemoval: false,
      renderCellWrapper: renderRowLink,
      verticalOnMobile: false,
      state: {
        columnVisibility: isMobile
          ? {
              description: true,
              motionState: true,
              team: false,
              createdAt: false,
            }
          : undefined,
        sorting,
        pagination: {
          pageIndex: pageNumber - 1,
          pageSize,
        },
      },
      additionalPaginationButtonsContent: loading
        ? undefined
        : additionalPaginationButtonsContent,
      onSortingChange: setSorting,
      getRowId: (row) => row.transactionHash,
      meatBallMenuStaticSize: '3.75rem',
      getMenuProps,
      columns,
      data,
      hasPagination: loading || hasNextPage || hasPrevPage,
      manualPagination: true,
      canNextPage: hasNextPage || loading,
      canPreviousPage: hasPrevPage,
      showTotalPagesNumber: false,
      nextPage: goToNextPage,
      previousPage: goToPreviousPage,
      paginationDisabled: loading,
      emptyContent: (
        <EmptyContent
          className="h-[32.8125rem]"
          icon="binoculars"
          title={{ id: 'activityFeedTable.table.emptyTitle' }}
          description={{ id: 'activityFeedTable.table.emptyDescription' }}
          buttonText={{ id: 'activityFeedTable.table.emptyButtonLabel' }}
          onClick={() => toggleActionSidebarOn()}
          withoutButtonIcon
        />
      ),
    },
    rest,
  );

  return withHeader ? (
    <TableWithActionsHeader<
      ColonyAction,
      TableWithMeatballMenuProps<ColonyAction>
    >
      title={formatText({ id: 'activityFeedTable.table.title' })}
      tableComponent={TableWithMeatballMenu}
      tableProps={tableProps}
      headerClassName="w-full"
    >
      <Filters
        items={filterItems}
        onChange={setFilters}
        onSearch={setSearchFilter}
        searchValue={searchFilter}
        value={filters}
      />
    </TableWithActionsHeader>
  ) : (
    <TableWithMeatballMenu {...tableProps} />
  );
};

ColonyActionsTable.displayName = displayName;

export default ColonyActionsTable;
