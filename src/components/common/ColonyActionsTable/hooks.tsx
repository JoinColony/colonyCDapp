import { createColumnHelper, SortingState } from '@tanstack/react-table';
import clsx from 'clsx';
import { format } from 'date-fns';
import { FilePlus, ArrowSquareOut, ShareNetwork } from 'phosphor-react';
import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, Link, useNavigate } from 'react-router-dom';

import { DEFAULT_NETWORK_INFO } from '~constants/index.ts';
import { useColonyContext } from '~context/ColonyContext.tsx';
import {
  SearchableColonyActionSortableFields,
  SearchableColonyActionSortInput,
  SearchableSortDirection,
} from '~gql';
import useActivityFeed from '~hooks/useActivityFeed/index.ts';
import { ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { RefetchMotionStates } from '~hooks/useNetworkMotionStates.ts';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes/index.ts';
import TransactionLink from '~shared/TransactionLink/index.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey.ts';
import { formatText } from '~utils/intl.ts';
import { setQueryParamOnUrl } from '~utils/urls.ts';
import MotionStateBadge from '~v5/common/Pills/MotionStateBadge/index.ts';
import TeamBadge from '~v5/common/Pills/TeamBadge/index.ts';
import { RenderCellWrapper } from '~v5/common/Table/types.ts';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/TableWithMeatballMenu/consts.ts';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types.ts';

import ActionDescription from './partials/ActionDescription/index.ts';
import MeatballMenuCopyItem from './partials/MeatballMenuCopyItem/index.ts';
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
) =>
  useMemo(() => {
    const helper = createColumnHelper<ActivityFeedColonyAction>();

    return [
      helper.display({
        id: 'description',
        staticSize: '100%',
        header: formatText(MSG.tableHeaderLatestActivity),
        enableSorting: false,
        cell: ({ row: { original } }) => (
          <ActionDescription
            action={original}
            loading={loading}
            refetchMotionStates={refetchMotionStates}
          />
        ),
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
        staticSize: '6.25rem',
        header: formatText({
          id: 'activityFeedTable.table.header.status',
        }),
        enableSorting: false,
        cell: ({ getValue }) => {
          const motionState = getValue();

          return (
            <MotionStateBadge
              state={motionState || MotionState.Forced}
              className={clsx({ skeleton: loading || loadingMotionStates })}
            />
          );
        },
      }),
    ];
  }, [loading, loadingMotionStates, refetchMotionStates]);

export const useGetColonyActionsTableMenuProps = (loading: boolean) => {
  const navigate = useNavigate();
  const colonyName = useColonyContext().colony.name;

  return useCallback<
    TableWithMeatballMenuProps<ActivityFeedColonyAction>['getMenuProps']
  >(
    ({ original: { transactionHash } }) => ({
      disabled: loading,
      items: [
        {
          key: '1',
          label: formatText({ id: 'activityFeedTable.menu.view' }),
          icon: <FilePlus size={16} />,
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
          icon: <ArrowSquareOut size={16} />,
        },
        {
          key: '3',
          label: formatText({ id: 'activityFeedTable.menu.share' }),
          renderItemWrapper: (props, children) => (
            <MeatballMenuCopyItem
              textToCopy={`${window.location.origin}/${generatePath(
                COLONY_HOME_ROUTE,
                { colonyName },
              )}${COLONY_ACTIVITY_ROUTE}?${TX_SEARCH_PARAM}=${transactionHash}`}
              {...props}
            >
              {children}
            </MeatballMenuCopyItem>
          ),
          icon: <ShareNetwork size={16} />,
          onClick: () => false,
        },
      ],
    }),
    [colonyName, loading, navigate],
  );
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
