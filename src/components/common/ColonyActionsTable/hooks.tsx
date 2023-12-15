import { createColumnHelper, SortingState } from '@tanstack/react-table';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FilePlus,
  ArrowSquareOut,
  ShareNetwork,
  FlagPennant,
  Scales,
  Calendar,
} from '@phosphor-icons/react';

import { generatePath, Link, useNavigate } from 'react-router-dom';
import MotionStateBadge from '~v5/common/Pills/MotionStateBadge';
import TeamBadge from '~v5/common/Pills/TeamBadge';
import {
  SearchableColonyActionSortableFields,
  SearchableColonyActionSortInput,
  SearchableSortDirection,
} from '~gql';
import {
  useActivityFeed,
  useColonyContext,
  useDebouncedValue,
  useMobile,
} from '~hooks';
import {
  ActivityDecisionMethod,
  ActivityFeedColonyAction,
  ActivityFeedFilters,
} from '~hooks/useActivityFeed/types';
import { MotionState } from '~utils/colonyMotions';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import { formatText } from '~utils/intl';
import { RenderCellWrapper } from '~v5/common/Table/types';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/TableWithMeatballMenu/consts';
import TransactionLink from '~shared/TransactionLink';
import { DEFAULT_NETWORK_INFO } from '~constants';
import { RefetchMotionStates } from '~hooks/useNetworkMotionStates';
import { FiltersProps } from '~v5/shared/Filters/types';
import { objectEntries } from '~utils/object';
import { useGetSelectedTeamFilter } from '~hooks/useTeamsBreadcrumbs';
import { setQueryParamOnUrl } from '~utils/urls';
import { cloneDeep } from '~utils/lodash';

import { getDateFilter, makeLoadingRows } from './utils';
import ActionDescription from './partials/ActionDescription';
import MeatballMenuCopyItem from './partials/MeatballMenuCopyItem';
import { ColonyActionsTableFilters } from './types';
import {
  ACTION_TYPE_TO_API_ACTION_TYPES_MAP,
  FILTER_MOTION_STATES,
} from './consts';
import { useActionsList } from '~v5/common/ActionSidebar/hooks';
import { Action } from '~constants/actions';
import { AnyActionType } from '~types';
import { pickOneOfFilters } from '~v5/shared/Filters/utils';

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
        staticSize: isMobile
          ? 'calc(100% - 6.25rem - 3.75rem)'
          : 'calc(100% - 7.8125rem - 10.3125rem - 3.75rem - 6.25rem)',
        header: formatText({
          id: 'activityFeedTable.table.header.description',
        }),
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
  }, [isMobile, loading, loadingMotionStates, refetchMotionStates]);
};

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

export const useActionsTableData = (
  pageSize: number,
  activityFeedFilters: ActivityFeedFilters,
) => {
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
        ...activityFeedFilters,
        teamId: selectedTeam?.id || undefined,
      }),
      [selectedTeam?.id, activityFeedFilters],
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

export const useColonyActionsTableFilters = () => {
  const actionOptions = useActionsList().flatMap(({ options }) => options);
  const filterItems: FiltersProps<ColonyActionsTableFilters>['items'] = useMemo(
    () => [
      {
        icon: <FilePlus size={14} />,
        label: formatText({ id: 'activityFeedTable.filters.actionType' }),
        name: 'actionType',
        title: formatText({ id: 'activityFeedTable.filters.actionType' }),
        items: actionOptions.map(({ label, value }) => ({
          label: formatText(label),
          name: value as Action,
        })),
      },
      {
        icon: <FlagPennant size={14} />,
        label: formatText({ id: 'activityFeedTable.filters.status' }),
        name: 'status',
        title: formatText({ id: 'activityFeedTable.filters.status' }),
        items: FILTER_MOTION_STATES.map((state) => ({
          label: formatText({ id: 'motion.state' }, { state }),
          name: state,
        })),
      },
      {
        icon: <Calendar size={14} />,
        label: formatText({ id: 'activityFeedTable.filters.date' }),
        name: 'date',
        title: formatText({ id: 'activityFeedTable.filters.date' }),
        items: [
          {
            label: formatText({
              id: 'activityFeedTable.filters.date.pastHour',
            }),
            name: 'pastHour',
          },
          {
            label: formatText({ id: 'activityFeedTable.filters.date.pastDay' }),
            name: 'pastDay',
          },
          {
            label: formatText({
              id: 'activityFeedTable.filters.date.pastWeek',
            }),
            name: 'pastWeek',
          },
          {
            label: formatText({
              id: 'activityFeedTable.filters.date.pastMonth',
            }),
            name: 'pastMonth',
          },
          {
            label: formatText({
              id: 'activityFeedTable.filters.date.pastYear',
            }),
            name: 'pastYear',
          },
        ],
      },
      {
        icon: <Scales size={14} />,
        label: 'Decision Method',
        name: 'decisionMethod',
        title: 'Decision Method',
        items: [
          {
            label: 'Permissions',
            name: ActivityDecisionMethod.Permissions,
          },
          {
            label: 'Reputation',
            name: ActivityDecisionMethod.Reputation,
          },
        ],
      },
    ],
    [actionOptions],
  );

  const [searchFilter, setSearchFilter] = useState('');
  const debouncedSearchFilter = useDebouncedValue(searchFilter, 500);
  const [filters, setFilters] = useState<
    FiltersProps<ColonyActionsTableFilters>['value']
  >({});
  const activityFeedFilters = useMemo<ActivityFeedFilters>(() => {
    const motionStates = filters?.status
      ? objectEntries(filters?.status).reduce<MotionState[]>(
          (result, [key, value]) => {
            if (value) {
              return [...result, getEnumValueFromKey(MotionState, key)];
            }

            return result;
          },
          [],
        )
      : [];
    const [decisionMethod] = filters?.decisionMethod
      ? objectEntries(filters?.decisionMethod).find(([, value]) => !!value) ||
        []
      : [];
    const actionTypes = filters?.actionType
      ? objectEntries(filters?.actionType).reduce<AnyActionType[]>(
          (result, [actionType, value]) => {
            const apiActionTypes =
              ACTION_TYPE_TO_API_ACTION_TYPES_MAP[actionType];

            if (!value || !apiActionTypes) {
              return result;
            }

            return [...result, ...apiActionTypes];
          },
          [],
        )
      : [];
    const date = getDateFilter(filters?.date);

    return {
      ...(motionStates.length ? { motionStates } : {}),
      ...(debouncedSearchFilter ? { search: debouncedSearchFilter } : {}),
      ...(decisionMethod
        ? {
            decisionMethod,
          }
        : {}),
      ...(actionTypes.length ? { actionTypes } : {}),
      ...(date || {}),
    };
  }, [
    filters?.status,
    filters?.decisionMethod,
    filters?.actionType,
    filters?.date,
    debouncedSearchFilter,
  ]);

  return {
    filters,
    setFilters: useCallback<
      FiltersProps<ColonyActionsTableFilters>['onChange']
    >((newFilters) => {
      setFilters((prevFilters) => {
        const newFiltersClone = cloneDeep(newFilters);

        if (newFilters.decisionMethod && prevFilters.decisionMethod) {
          newFiltersClone.decisionMethod = pickOneOfFilters(
            newFilters.decisionMethod,
            prevFilters.decisionMethod,
          );
        }

        if (newFilters.date && prevFilters.date) {
          newFiltersClone.date = pickOneOfFilters(
            newFilters.date,
            prevFilters.date,
          );
        }

        return newFiltersClone;
      });
    }, []),
    searchFilter,
    setSearchFilter,
    activityFeedFilters,
    filterItems,
  };
};
