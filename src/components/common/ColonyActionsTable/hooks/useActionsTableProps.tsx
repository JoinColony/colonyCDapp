import { Binoculars } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import {
  useActionSidebarContext,
  ActionSidebarMode,
} from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useMobile } from '~hooks/index.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { merge } from '~utils/lodash.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import {
  EXPANDER_COLUMN_ID,
  MEATBALL_MENU_COLUMN_ID,
} from '~v5/common/Table/consts.ts';
import { type TableProps } from '~v5/common/Table/types.ts';

import {
  CREATED_AT_COLUMN_ID,
  DESCRIPTION_COLUMN_ID,
  MOTION_STATE_COLUMN_ID,
  TEAM_COLUMN_ID,
} from '../consts.ts';
import { useFiltersContext } from '../FiltersContext/FiltersContext.ts';
import { type ColonyActionsTableProps } from '../types.ts';

import useActionsTableData from './useActionsTableData.ts';
import useColonyActionsTableColumns from './useColonyActionsTableColumns.tsx';
import { useGetMenuProps } from './useGetMenuProps.tsx';
import useRenderRowLink from './useRenderRowLink.tsx';
import useRenderSubComponent from './useRenderSubComponent.tsx';

export const useActionsTableProps = (
  props: Omit<ColonyActionsTableProps, 'withHeader' | 'actionProps'>,
  setAction: ColonyActionsTableProps['actionProps']['setSelectedAction'],
) => {
  const {
    className,
    pageSize = 10,
    pagination,
    overrides,
    showUserAvatar,
    isRecentActivityVariant,
  } = props;

  const { searchFilter, selectedFiltersCount } = useFiltersContext();

  const {
    data: colonyActions,
    loading: colonyActionsLoading,
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

  const getMenuProps = useGetMenuProps({
    setAction,
    colonyActions,
    colonyActionsLoading,
  });

  const columns = useColonyActionsTableColumns({
    loading: colonyActionsLoading,
    loadingMotionStates,
    refetchMotionStates,
    showUserAvatar,
    isRecentActivityVariant,
    getMenuProps,
  });
  const { showActionSidebar } = useActionSidebarContext();

  const renderRowLink = useRenderRowLink(
    colonyActionsLoading,
    isRecentActivityVariant,
  );

  const renderSubComponent = useRenderSubComponent({
    loadingMotionStates,
    loading: colonyActionsLoading,
    refetchMotionStates,
    getMenuProps,
  });

  const isMobile = useMobile();

  const tableProps = merge({
    className: clsx(
      className,
      '[&_td:first-child]:pl-4 sm:[&_td:first-child]:pl-4.5 [&_td]:pr-4 sm:[&_td]:pr-4.5 [&_th:first-child]:pl-4 sm:[&_th:first-child]:pl-4.5 [&_th:not(:first-child)]:pl-0 [&_th]:pr-4 sm:[&_th]:pr-4.5',
      {
        'sm:[&_td]:h-[66px]': isRecentActivityVariant,
        'sm:[&_td]:h-[70px]': !isRecentActivityVariant,
        'sm:[&_tr:hover]:bg-gray-25':
          colonyActions.length > 0 && !colonyActionsLoading,
      },
    ),
    overrides: merge(
      {
        enableSortingRemoval: false,
        onSortingChange: setSorting,
        state: {
          columnVisibility: isMobile
            ? {
                [DESCRIPTION_COLUMN_ID]: true,
                [MOTION_STATE_COLUMN_ID]: true,
                [TEAM_COLUMN_ID]: false,
                [CREATED_AT_COLUMN_ID]: false,
                [MEATBALL_MENU_COLUMN_ID]: false,
              }
            : {
                [DESCRIPTION_COLUMN_ID]: true,
                [MOTION_STATE_COLUMN_ID]: true,
                [TEAM_COLUMN_ID]: false,
                [CREATED_AT_COLUMN_ID]: true,
                [EXPANDER_COLUMN_ID]: false,
              },
          sorting,
          pagination: {
            pageIndex: pageNumber - 1,
            pageSize,
          },
        },
        manualPagination: true,
        getRowId: (row) => row.transactionHash,
      },
      overrides,
    ),
    pagination: merge(
      {
        children: colonyActionsLoading ? undefined : pagination?.children,
        canNextPage: hasNextPage || colonyActionsLoading,
        canPreviousPage: hasPrevPage,
        onPageChange: (direction) => {
          if (direction === 'previous') {
            goToPreviousPage();
          } else {
            goToNextPage();
          }
        },
        disabled: colonyActionsLoading,
      },
      pagination,
    ),
    rows: {
      canExpand: () => isMobile,
      renderSubComponent,
    },
    columns,
    renderCellWrapper: renderRowLink,
    data: colonyActions,
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
            : () => showActionSidebar(ActionSidebarMode.ViewAction)
        }
        withoutButtonIcon
      />
    ),
  } as TableProps<ColonyAction>);

  return { tableProps };
};
