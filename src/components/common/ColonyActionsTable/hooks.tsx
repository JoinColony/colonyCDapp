import {
  FilePlus,
  ArrowSquareOut,
  ShareNetwork,
  FlagPennant,
  Scales,
  Calendar,
} from '@phosphor-icons/react';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, Link, useNavigate } from 'react-router-dom';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { Action } from '~constants/actions';
import {
  SearchableColonyActionSortableFields,
  SearchableColonyActionSortInput,
  SearchableSortDirection,
} from '~gql';
import {
  useActivityFeed,
  useColonyContext,
  useDebouncedValue,
  useGetSelectedDomainFilter,
} from '~hooks';
import {
  ActivityFeedColonyAction,
  ActivityDecisionMethod,
  ActivityFeedFilters,
} from '~hooks/useActivityFeed/types';
import { RefetchMotionStates } from '~hooks/useNetworkMotionStates';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import TransactionLink from '~shared/TransactionLink';
import { AnyActionType } from '~types';
import { MotionState } from '~utils/colonyMotions';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey';
import { formatText } from '~utils/intl';
import { cloneDeep } from '~utils/lodash';
import { objectEntries } from '~utils/object';
import { setQueryParamOnUrl } from '~utils/urls';
import { useActionsList } from '~v5/common/ActionSidebar/hooks';
import Datepicker from '~v5/common/Fields/Datepicker';
import { DEFAULT_DATE_FORMAT } from '~v5/common/Fields/Datepicker/consts';
import MotionStateBadge from '~v5/common/Pills/MotionStateBadge';
import TeamBadge from '~v5/common/Pills/TeamBadge';
import { RenderCellWrapper } from '~v5/common/Table/types';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/TableWithMeatballMenu/consts';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';
import { FiltersProps } from '~v5/shared/Filters/types';
import { pickOneOfFilters } from '~v5/shared/Filters/utils';

import {
  ACTION_TYPE_TO_API_ACTION_TYPES_MAP,
  FILTER_MOTION_STATES,
} from './consts';
import ActionDescription from './partials/ActionDescription';
import MeatballMenuCopyItem from './partials/MeatballMenuCopyItem';
import {
  ColonyActionsTableFilters,
  ColonyActionsTableFiltersValue,
} from './types';
import { getDateFilter, makeLoadingRows } from './utils';

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
  const selectedTeam = useGetSelectedDomainFilter();
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

  const filterItems = useMemo<FiltersProps<ColonyActionsTableFilters>['items']>(
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
        popoverClassName: 'sm:!max-w-[21.25rem]',
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
            name: 'custom',
            renderPickedLabel: ({ value }) => {
              const [startDateString, endDateString] = value || [];

              if (!startDateString || !endDateString) {
                return null;
              }

              const startDate = new Date(startDateString);
              const endDate = new Date(endDateString);

              return (
                <span>
                  {format(startDate, DEFAULT_DATE_FORMAT)} -{' '}
                  {format(endDate, DEFAULT_DATE_FORMAT)}
                </span>
              );
            },
            render: ({ value, onChange }) => {
              const [startDate, endDate] = value || [];

              return (
                <div className="sm:px-3.5">
                  <span className="text-4 text-gray-400 uppercase">
                    {formatText({
                      id: 'activityFeedTable.filters.date.custom',
                    })}
                  </span>
                  <div className="mt-4">
                    <Datepicker
                      onChange={(newValue) => {
                        const [newStartDate, newEndDate] = newValue;

                        onChange(
                          !newStartDate && !newEndDate
                            ? undefined
                            : [
                                newStartDate?.toString(),
                                newEndDate?.toString(),
                              ],
                        );
                      }}
                      selectsRange
                      startDate={startDate ? new Date(startDate) : undefined}
                      endDate={endDate ? new Date(endDate) : undefined}
                      maxDate={new Date()}
                    />
                  </div>
                </div>
              );
            },
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
  const [filters, setFilters] = useState<ColonyActionsTableFiltersValue>({});
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
