import {
  ArrowSquareOut,
  FilePlus,
  ShareNetwork,
  Binoculars,
  Repeat,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

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
import { type ColonyAction } from '~types/graphql.ts';
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
  props: Omit<ColonyActionsTableProps, 'withHeader' | 'actionProps'>,
  setAction: (actionHash: string) => void,
) => {
  const {
    className,
    pageSize = 10,
    additionalPaginationButtonsContent,
    showTotalPagesNumber,
    showUserAvatar,
    isRecentActivityVariant,
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

  const columns = useColonyActionsTableColumns({
    loading,
    loadingMotionStates,
    refetchMotionStates,
    showUserAvatar,
  });
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();
  const navigate = useNavigate();
  const {
    colony: { name: colonyName },
  } = useColonyContext();
  const getMenuProps: TableProps<ActivityFeedColonyAction>['getMenuProps'] = ({
    original: { transactionHash },
  }) => ({
    disabled: loading,
    dropdownPlacementProps: {
      withAutoTopPlacement: true,
      top: 10,
    },
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
      {
        key: '4',
        label: formatText({ id: 'completedAction.redoAction' }),
        icon: Repeat,
        onClick: () => setAction(transactionHash),
      },
    ],
  });
  const isMobile = useMobile();
  const renderRowLink = useRenderRowLink(loading, isRecentActivityVariant);
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
        'sm:[&_td:first-child]:pl-[1.125rem] sm:[&_td]:pr-[1.125rem] sm:[&_th:first-child]:pl-[1.125rem] sm:[&_th:not(:first-child)]:pl-0 sm:[&_th]:pr-[1.125rem]',
        {
          'sm:[&_td]:h-[66px]': isRecentActivityVariant,
          'sm:[&_td]:h-[70px]': !isRecentActivityVariant,
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
      meatBallMenuStaticSize: isRecentActivityVariant ? '2rem' : '3rem',
      getMenuProps,
      columns,
      data,
      manualPagination: true,
      canNextPage: hasNextPage || loading,
      canPreviousPage: hasPrevPage,
      showTotalPagesNumber,
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
            searchFilter || selectedFiltersCount
              ? undefined
              : () => toggleActionSidebarOn()
          }
          withoutButtonIcon
        />
      ),
    } as TableProps<ColonyAction>,
    rest,
  );

  return { tableProps, renderSubComponent };
};
