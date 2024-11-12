import { Binoculars } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useMobile } from '~hooks/index.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { merge } from '~utils/lodash.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/Table/consts.ts';
import { type TableProps } from '~v5/common/Table/types.ts';

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
    additionalPaginationButtonsContent,
    showTotalPagesNumber,
    showUserAvatar,
    isRecentActivityVariant,
    ...rest
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

  const columns = useColonyActionsTableColumns({
    loading: colonyActionsLoading,
    loadingMotionStates,
    refetchMotionStates,
    showUserAvatar,
  });
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const getMenuProps = useGetMenuProps({
    setAction,
    colonyActions,
    colonyActionsLoading,
  });

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

  const tableProps = merge(
    {
      className: clsx(
        className,
        'sm:[&_td:first-child]:pl-[1.125rem] sm:[&_td]:pr-[1.125rem] sm:[&_th:first-child]:pl-[1.125rem] sm:[&_th:not(:first-child)]:pl-0 sm:[&_th]:pr-[1.125rem]',
        {
          'sm:[&_td]:h-[66px]': isRecentActivityVariant,
          'sm:[&_td]:h-[70px]': !isRecentActivityVariant,
          'sm:[&_tr:hover]:bg-gray-25':
            colonyActions.length > 0 && !colonyActionsLoading,
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
      additionalPaginationButtonsContent: colonyActionsLoading
        ? undefined
        : additionalPaginationButtonsContent,
      onSortingChange: setSorting,
      getRowId: (row) => row.transactionHash,
      meatBallMenuStaticSize: isRecentActivityVariant ? '2rem' : '3rem',
      getMenuProps,
      columns,
      data: colonyActions,
      manualPagination: true,
      canNextPage: hasNextPage || colonyActionsLoading,
      canPreviousPage: hasPrevPage,
      showTotalPagesNumber,
      nextPage: goToNextPage,
      previousPage: goToPreviousPage,
      paginationDisabled: colonyActionsLoading,
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
