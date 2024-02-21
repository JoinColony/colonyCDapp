import {
  ArrowSquareOut,
  Binoculars,
  FilePlus,
  ShareNetwork,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { APP_URL, DEFAULT_NETWORK_INFO } from '~constants';
import { useActionSidebarContext } from '~context/ActionSidebarContext/index.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { useMobile } from '~hooks/index.ts';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import TransactionLink from '~shared/TransactionLink/index.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { merge } from '~utils/lodash.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/Table/consts.ts';
import Table from '~v5/common/Table/index.ts';
import { type TableProps } from '~v5/common/Table/types.ts';
import TableHeader from '~v5/common/TableHeader/TableHeader.tsx';

import {
  useActionsTableData,
  useColonyActionsTableColumns,
  useRenderRowLink,
  useRenderSubComponent,
} from './hooks.tsx';
import MeatballMenuCopyItem from './partials/MeatballMenuCopyItem/index.ts';
import { type ColonyActionsTableProps } from './types.ts';

const displayName = 'common.ColonyActionsTable';

const ColonyActionsTable: FC<ColonyActionsTableProps> = ({
  pageSize = 10,
  withHeader = true,
  className,
  additionalPaginationButtonsContent,
  ...rest
}) => {
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
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();
  const navigate = useNavigate();
  const {
    colony: { name: colonyName },
  } = useColonyContext();
  const getMenuProps = ({ original: { transactionHash } }) => ({
    disabled: loading,
    items: [
      {
        key: '1',
        label: formatText({ id: 'activityFeedTable.menu.view' }),
        icon: FilePlus,
        onClick: () => {
          navigate(
            `${window.location.pathname}?${TX_SEARCH_PARAM}=${transactionHash}`,
            {
              replace: true,
            },
          );
        },
      },
      {
        key: '2',
        label: (
          <TransactionLink
            hash={transactionHash}
            text={{ id: 'activityFeedTable.menu.viewOnNetwork' }}
            textValues={{
              blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
            }}
          />
        ),
        icon: ArrowSquareOut,
      },
      {
        key: '3',
        label: formatText({ id: 'activityFeedTable.menu.share' }),
        renderItemWrapper: (props, children) => (
          <MeatballMenuCopyItem
            textToCopy={`${APP_URL.origin}/${generatePath(COLONY_HOME_ROUTE, {
              colonyName,
            })}${COLONY_ACTIVITY_ROUTE}?${TX_SEARCH_PARAM}=${transactionHash}`}
            {...props}
          >
            {children}
          </MeatballMenuCopyItem>
        ),
        icon: ShareNetwork,
        onClick: () => false,
      },
    ],
  });
  const isMobile = useMobile();
  const renderRowLink = useRenderRowLink(loading);
  const renderSubComponent = useRenderSubComponent(
    loadingMotionStates,
    refetchMotionStates,
    getMenuProps,
  );
  const tableProps: TableProps<ColonyAction> = merge(
    {
      className: clsx(className, {
        'sm:[&_tr:hover]:bg-gray-25': data.length > 0 && !loading,
      }),
      enableSortingRemoval: false,
      renderCellWrapper: isMobile ? undefined : renderRowLink,
      verticalOnMobile: false,
      state: {
        columnVisibility: isMobile
          ? {
              description: true,
              motionState: true,
              team: false,
              createdAt: false,
              [MEATBALL_MENU_COLUMN_ID]: false,
            }
          : {
              expander: false,
            },
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
      getRowCanExpand: () => isMobile,
      emptyContent: (
        <EmptyContent
          className="h-[32.8125rem]"
          icon={Binoculars}
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

  return (
    <>
      {withHeader && (
        <TableHeader
          title={formatText({ id: 'activityFeedTable.table.title' })}
        />
      )}
      <Table<ColonyAction>
        {...tableProps}
        renderSubComponent={renderSubComponent}
      />
    </>
  );
};

ColonyActionsTable.displayName = displayName;

export default ColonyActionsTable;
