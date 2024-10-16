import {
  ArrowSquareOut,
  FilePlus,
  ShareNetwork,
  Binoculars,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { type ActionData } from '~actions';
import { APP_URL, DEFAULT_NETWORK_INFO } from '~constants';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import TransactionLink from '~shared/TransactionLink/index.ts';
import { formatText } from '~utils/intl.ts';
import { merge } from '~utils/lodash.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/Table/consts.ts';
import { type TableProps } from '~v5/common/Table/types.ts';

import { useFiltersContext } from '../FiltersContext/FiltersContext.ts';
import MeatballMenuCopyItem from '../partials/MeatballMenuCopyItem/MeatballMenuCopyItem.tsx';
import { type ColonyActionsTableProps } from '../types.ts';

import useActionsTableData from './useActionsTableData.ts';
import useColonyActionsTableColumns from './useColonyActionsTableColumns.tsx';
import useRenderRowLink from './useRenderRowLink.tsx';
import useRenderSubComponent from './useRenderSubComponent.tsx';

export const useActionsTableProps = (
  props: Omit<ColonyActionsTableProps, 'withHeader'>,
) => {
  const {
    className,
    pageSize = 10,
    additionalPaginationButtonsContent,
    ...rest
  } = props;

  const { searchFilter, selectedFiltersCount } = useFiltersContext();

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
  const { show } = useActionSidebarContext();
  const navigate = useNavigate();
  const {
    colony: { name: colonyName },
  } = useColonyContext();
  const getMenuProps: TableProps<ActivityFeedColonyAction>['getMenuProps'] = ({
    original: { transactionHash },
  }) => ({
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
          <TransactionLink hash={transactionHash}>
            {formatText(
              { id: 'activityFeedTable.menu.viewOnNetwork' },
              {
                blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
              },
            )}
          </TransactionLink>
        ),
        icon: ArrowSquareOut,
      },
      {
        key: '3',
        label: formatText({ id: 'activityFeedTable.menu.share' }),
        renderItemWrapper: (itemWrapperProps, children) => (
          <MeatballMenuCopyItem
            textToCopy={`${APP_URL.origin}/${generatePath(COLONY_HOME_ROUTE, {
              colonyName,
            })}${COLONY_ACTIVITY_ROUTE}?${TX_SEARCH_PARAM}=${transactionHash}`}
            {...itemWrapperProps}
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
  const renderSubComponent = useRenderSubComponent({
    loadingMotionStates,
    loading,
    refetchMotionStates,
    getMenuProps,
  });
  const tableProps = merge(
    {
      className: clsx(
        className,
        'sm:[&_td:first-child]:pl-[1.125rem] sm:[&_td]:h-[70px] sm:[&_td]:pr-[1.125rem] sm:[&_th:first-child]:pl-[1.125rem] sm:[&_th:not(:first-child)]:pl-0 sm:[&_th]:pr-[1.125rem]',
        {
          'sm:[&_tr:hover]:bg-gray-25': data.length > 0 && !loading,
        },
      ),
      enableSortingRemoval: false,
      renderCellWrapper: isMobile ? undefined : renderRowLink,
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
      meatBallMenuStaticSize: '3rem',
      getMenuProps,
      columns,
      data,
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
          className="h-[19.125rem] sm:h-[32.8125rem]"
          icon={Binoculars}
          title={{
            id:
              searchFilter || selectedFiltersCount
                ? 'activityFeedTable.table.search.emptyTitle'
                : 'activityFeedTable.table.emptyTitle',
          }}
          description={{
            id:
              searchFilter || selectedFiltersCount
                ? 'activityFeedTable.table.search.emptyDescription'
                : 'activityFeedTable.table.emptyDescription',
          }}
          buttonText={
            searchFilter || selectedFiltersCount
              ? undefined
              : { id: 'activityFeedTable.table.emptyButtonLabel' }
          }
          onClick={
            searchFilter || selectedFiltersCount ? undefined : () => show()
          }
          withoutButtonIcon
        />
      ),
    } as TableProps<ActionData>,
    rest,
  );

  return { tableProps, renderSubComponent };
};
