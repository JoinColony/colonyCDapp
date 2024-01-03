import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import clsx from 'clsx';
import { format } from 'date-fns';
import { FilePlus, ArrowSquareOut, ShareNetwork } from 'phosphor-react';

import { generatePath, Link, useNavigate } from 'react-router-dom';
import {
  SearchableColonyActionSortableFields,
  SearchableColonyActionSortInput,
  SearchableSortDirection,
} from '~gql';
import { useActivityFeed, useColonyContext } from '~hooks';
import { ActivityFeedColonyAction } from '~hooks/useActivityFeed/types';
import { MotionState } from '~utils/colonyMotions';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import { formatText } from '~utils/intl';
import TransactionLink from '~shared/TransactionLink';
import { DEFAULT_NETWORK_INFO } from '~constants';
import { RefetchMotionStates } from '~hooks/useNetworkMotionStates';
import { setQueryParamOnUrl } from '~utils/urls';
import { useGetSelectedTeamFilter } from '~hooks/useTeamsBreadcrumbs';
import MotionStateBadge from '~v5/common/Pills/MotionStateBadge';
import TeamBadge from '~v5/common/Pills/TeamBadge';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';
import { RenderCellWrapper } from '~v5/common/Table/types';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/TableWithMeatballMenu/consts';

import { makeLoadingRows } from './utils';
import ActionDescription from './partials/ActionDescription';
import MeatballMenuCopyItem from './partials/MeatballMenuCopyItem';

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
              teamName={team?.name || ''.padEnd(6, '-')}
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
  const colonyName = useColonyContext().colony?.name || '';

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
              textToCopy={`${window.location.origin}${generatePath(
                COLONY_HOME_ROUTE,
                { colonyName },
              )}/${COLONY_ACTIVITY_ROUTE}?${TX_SEARCH_PARAM}=${transactionHash}`}
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
  const selectedTeam = useGetSelectedTeamFilter();
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
        teamId: selectedTeam?.id || undefined,
      }),
      [selectedTeam?.id],
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
  return (className, content, { cell, row, renderDefault }) =>
    cell.column.columnDef.id === MEATBALL_MENU_COLUMN_ID || loading ? (
      renderDefault()
    ) : (
      <Link
        className={clsx(className, '!py-[.5625rem]')}
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
