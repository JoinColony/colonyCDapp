import { CaretDown } from '@phosphor-icons/react';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';

import { useMobile } from '~hooks';
import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import { type RefetchMotionStates } from '~hooks/useNetworkMotionStates.ts';
import { formatText } from '~utils/intl.ts';
import { DEFAULT_DATE_FORMAT } from '~v5/common/Fields/datepickers/common/consts.ts';
import TeamBadge from '~v5/common/Pills/TeamBadge/index.ts';

import ActionBadge from '../partials/ActionBadge/ActionBadge.tsx';
import ActionDescription from '../partials/ActionDescription/index.ts';

// NOTE: No idea why this is being picked up as an export
// eslint-disable-next-line react-refresh/only-export-components
const MSG = defineMessages({
  tableHeaderLatestActivity: {
    id: 'common.ColonyActionsTable',
    defaultMessage: 'Latest activity',
  },
});

const useColonyActionsTableColumns = (
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
        staticSize: '8.125rem',
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
        staticSize: '8rem',
        header: formatText({
          id: 'activityFeedTable.table.header.date',
        }),
        cell: ({ getValue }) => {
          const date = format(new Date(getValue()), DEFAULT_DATE_FORMAT);

          return (
            <span
              className={clsx(
                'whitespace-nowrap text-md font-normal text-gray-600',
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
        cell: ({ getValue, row: { getIsExpanded, original } }) => {
          const motionState = getValue();
          const { expenditureId } = original;

          return getIsExpanded() ? null : (
            <ActionBadge
              motionState={motionState}
              loading={loading || loadingMotionStates}
              expenditureId={expenditureId ?? undefined}
              className={clsx({
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

export default useColonyActionsTableColumns;
