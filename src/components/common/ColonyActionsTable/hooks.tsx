import { CaretDown } from '@phosphor-icons/react';
import {
  createColumnHelper,
  type Row,
  type SortingState,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  SearchableColonyActionSortableFields,
  type SearchableColonyActionSortInput,
  SearchableSortDirection,
} from '~gql';
import { useMobile } from '~hooks';
import useActivityFeed from '~hooks/useActivityFeed/index.ts';
import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { type RefetchMotionStates } from '~hooks/useNetworkMotionStates.ts';
import { TX_SEARCH_PARAM } from '~routes/index.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey.ts';
import { formatText } from '~utils/intl.ts';
import { setQueryParamOnUrl } from '~utils/urls.ts';
import MotionStateBadge from '~v5/common/Pills/MotionStateBadge/index.ts';
import TeamBadge from '~v5/common/Pills/TeamBadge/index.ts';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/Table/consts.ts';
import { type RenderCellWrapper } from '~v5/common/Table/types.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import ActionDescription from './partials/ActionDescription/index.ts';
import ActionMobileDescription from './partials/ActionMobileDescription/index.ts';
import { makeLoadingRows } from './utils.ts';

const MSG = defineMessages({
  tableHeaderLatestActivity: {
    id: 'common.ColonyActionsTable',
    defaultMessage: 'Latest activity',
  },
});

export const useColonyActionsTableColumns = (
  loading: boolean,
  loadingMotionStates: boolean,
  refetchMotionStates: RefetchMotionStates,
) => {
  const isMobile = useMobile();

  return useMemo(() => {
    const helper = createColumnHelper<ActivityFeedColonyAction>();

    return [
      helper.display({
        id: 'description',
        staticSize: '100%',
        header: formatText(MSG.tableHeaderLatestActivity),
        enableSorting: false,
        cell: ({ row: { original, getIsExpanded } }) => (
          <ActionDescription
            action={original}
            loading={loading}
            refetchMotionStates={refetchMotionStates}
            hideDetails={getIsExpanded()}
          />
        ),
        colSpan: (isExpanded) => (isExpanded ? 2 : undefined),
        cellContentWrapperClassName: 'pr-0',
      }),
      helper.display({
        id: 'team',
        staticSize: '7.8125rem',
        header: formatText({
          id: 'activityFeedTable.table.header.team',
        }),
        enableSorting: false,
        cell: ({
          row: {
            original: { motionData, fromDomain },
          },
        }) => {
          const team =
            fromDomain?.metadata || motionData?.motionDomain.metadata;

          return team || loading ? (
            <TeamBadge
              className={clsx({
                skeleton: loading,
              })}
              textClassName="line-clamp-1 break-all"
              name={team?.name || ''.padEnd(6, '-')}
              color={team?.color}
            />
          ) : null;
        },
      }),
      helper.accessor('createdAt', {
        staticSize: '10.3125rem',
        header: formatText({
          id: 'activityFeedTable.table.header.date',
        }),
        cell: ({ getValue }) => {
          const date = format(new Date(getValue()), 'dd MMMM yyyy');

          return (
            <span
              className={clsx(
                'font-normal text-md text-gray-600 whitespace-nowrap',
                {
                  skeleton: loading,
                },
              )}
            >
              {date}
            </span>
          );
        },
      }),
      helper.accessor('motionState', {
        staticSize: isMobile ? '7.4375rem' : '6.25rem',
        header: formatText({
          id: 'activityFeedTable.table.header.status',
        }),
        enableSorting: false,
        cell: ({ getValue, row: { getIsExpanded } }) => {
          const motionState = getValue();

          return getIsExpanded() ? null : (
            <MotionStateBadge
              state={motionState || MotionState.Unknown}
              className={clsx({
                skeleton: loading || loadingMotionStates,
                '!hidden': getIsExpanded(),
              })}
            />
          );
        },
        colSpan: (isExpanded) => (isExpanded ? 0 : undefined),
      }),
      helper.display({
        id: 'expander',
        staticSize: '2.25rem',
        header: () => null,
        enableSorting: false,
        cell: ({ row: { getIsExpanded, toggleExpanded } }) => {
          return (
            <button type="button" onClick={() => toggleExpanded()}>
              <CaretDown
                size={18}
                className={clsx('transition', {
                  'rotate-180': getIsExpanded(),
                })}
              />
            </button>
          );
        },
        cellContentWrapperClassName: 'pl-0',
      }),
    ];
  }, [isMobile, loading, loadingMotionStates, refetchMotionStates]);
};

export const useActionsTableData = (pageSize: number) => {
  const selectedDomain = useGetSelectedDomainFilter();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: true,
    },
  ]);
  const {
    actions,
    pageNumber,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPreviousPage,
    loadingFirstPage,
    loadingNextPage,
    loadingMotionStates,
    refetchMotionStates,
  } = useActivityFeed(
    useMemo(
      () => ({
        teamId: selectedDomain?.id || undefined,
      }),
      [selectedDomain?.id],
    ),
    useMemo(() => {
      const validSortValues = sorting?.reduce<
        SearchableColonyActionSortInput[]
      >((result, { desc, id }) => {
        try {
          const sortColumn = getEnumValueFromKey(
            SearchableColonyActionSortableFields,
            id,
          );

          return [
            ...result,
            {
              field: sortColumn,
              direction: desc
                ? SearchableSortDirection.Desc
                : SearchableSortDirection.Asc,
            },
          ];
        } catch {
          return result;
        }
      }, []);

      if (!validSortValues || !validSortValues.length) {
        return undefined;
      }

      return validSortValues;
    }, [sorting]),
    {
      pageSize,
    },
  );
  const loading = loadingFirstPage || loadingNextPage;

  return {
    pageNumber,
    refetchMotionStates,
    loadingMotionStates,
    data: loading ? makeLoadingRows(pageSize) : actions,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPreviousPage,
    loading,
    sorting,
    setSorting,
  };
};

export const useRenderRowLink = (
  loading: boolean,
): RenderCellWrapper<ActivityFeedColonyAction> => {
  const cellWrapperClassName = '!pt-[.5625rem] !pb-2';

  return (className, content, { cell, row }) =>
    cell.column.columnDef.id === MEATBALL_MENU_COLUMN_ID || loading ? (
      <div className={clsx(className, cellWrapperClassName)}>{content}</div>
    ) : (
      <Link
        className={clsx(className, cellWrapperClassName)}
        to={setQueryParamOnUrl(
          window.location.search,
          TX_SEARCH_PARAM,
          row.original.transactionHash,
        )}
      >
        {content}
      </Link>
    );
};

export const useRenderSubComponent = (
  loadingMotionStates: boolean,
  refetchMotionStates: RefetchMotionStates,
  getMenuProps: (
    row: Row<ActivityFeedColonyAction>,
  ) => MeatBallMenuProps | undefined,
) => {
  return ({ row }: { row: Row<ActivityFeedColonyAction> }) => (
    <ActionMobileDescription
      actionRow={row}
      loadingMotionStates={loadingMotionStates}
      refetchMotionStates={refetchMotionStates}
      getMenuProps={getMenuProps}
    />
  );
};
