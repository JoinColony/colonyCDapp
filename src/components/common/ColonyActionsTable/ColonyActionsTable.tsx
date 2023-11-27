import React, { FC } from 'react';
import { useMobile } from '~hooks';

import { ColonyAction } from '~types';
import { formatText } from '~utils/intl';
import TableWithActionsHeader from '~v5/common/TableWithActionsHeader';
import TableWithMeatballMenu from '~v5/common/TableWithMeatballMenu';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';

import {
  useActionsTableData,
  useColonyActionsTableColumns,
  useGetColonyActionsTableMenuProps,
  useRenderRowLink,
} from './hooks';
import { ColonyActionsTableProps } from './types';

const displayName = 'common.ColonyActionsTable';

const ColonyActionsTable: FC<ColonyActionsTableProps> = ({ pageSize = 10 }) => {
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
  } = useActionsTableData(pageSize);
  const columns = useColonyActionsTableColumns(
    loading,
    loadingMotionStates,
    refetchMotionStates,
  );
  const getMenuProps = useGetColonyActionsTableMenuProps(loading);
  const isMobile = useMobile();
  const renderRowLink = useRenderRowLink();

  return (
    <TableWithActionsHeader<
      ColonyAction,
      TableWithMeatballMenuProps<ColonyAction>
    >
      title={formatText({ id: 'activityFeedTable.table.title' })}
      tableComponent={TableWithMeatballMenu}
      tableProps={{
        className: '[&_tr:hover]:bg-gray-25',
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
        onSortingChange: setSorting,
        getRowId: (row) => row.transactionHash,
        meatBallMenuStaticSize: '3.75rem',
        getMenuProps,
        columns,
        data,
        hasPagination: hasNextPage || hasPrevPage,
        manualPagination: true,
        canNextPage: hasNextPage,
        canPreviousPage: hasPrevPage,
        showTotalPagesNumber: false,
        nextPage: goToNextPage,
        previousPage: goToPreviousPage,
        paginationDisabled: loading,
      }}
    />
  );
};

ColonyActionsTable.displayName = displayName;

export default ColonyActionsTable;
