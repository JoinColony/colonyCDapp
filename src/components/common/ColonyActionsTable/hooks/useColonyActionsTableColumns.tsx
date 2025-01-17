import { CaretDown } from '@phosphor-icons/react';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';

import { useMobile } from '~hooks';
import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import { getFormattedDateFrom } from '~utils/getFormattedDateFrom.ts';
import { formatText } from '~utils/intl.ts';
import TeamBadge from '~v5/common/Pills/TeamBadge/index.ts';
import { EXPANDER_COLUMN_ID } from '~v5/common/Table/consts.ts';
import { makeMenuColumn } from '~v5/common/Table/utils.tsx';

import {
  MOTION_STATE_COLUMN_ID,
  CREATED_AT_COLUMN_ID,
  DESCRIPTION_COLUMN_ID,
  TEAM_COLUMN_ID,
} from '../consts.ts';
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

const useColonyActionsTableColumns = ({
  loading,
  loadingMotionStates,
  refetchMotionStates,
  showUserAvatar = true,
  isRecentActivityVariant = false,
  getMenuProps,
}) => {
  const isMobile = useMobile();

  return useMemo(() => {
    const helper = createColumnHelper<ActivityFeedColonyAction>();

    return [
      helper.display({
        id: DESCRIPTION_COLUMN_ID,
        staticSize: '100%',
        header: formatText(MSG.tableHeaderLatestActivity),
        enableSorting: false,
        cell: ({ row: { original, getIsExpanded } }) => (
          <ActionDescription
            action={original}
            loading={loading}
            refetchMotionStates={refetchMotionStates}
            hideDetails={getIsExpanded()}
            showUserAvatar={showUserAvatar}
          />
        ),
        colSpan: (isExpanded) => (isExpanded ? 2 : undefined),
        cellContentWrapperClassName: 'pr-0',
      }),
      helper.display({
        id: TEAM_COLUMN_ID,
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
                'overflow-hidden rounded border-none skeleton': loading,
              })}
              textClassName="line-clamp-1 break-all"
              name={team?.name || ''.padEnd(6, '-')}
              color={team?.color}
            />
          ) : null;
        },
      }),
      helper.accessor(CREATED_AT_COLUMN_ID, {
        staticSize: '10rem',
        header: formatText({
          id: 'activityFeedTable.table.header.date',
        }),
        cell: ({ getValue }) => {
          const date = getFormattedDateFrom(new Date(getValue()));

          return (
            <span
              className={clsx(
                'whitespace-nowrap text-md font-normal text-gray-600',
                {
                  'overflow-hidden rounded skeleton': loading,
                },
              )}
            >
              {date}
            </span>
          );
        },
      }),
      helper.accessor(MOTION_STATE_COLUMN_ID, {
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
        cellContentWrapperClassName: isRecentActivityVariant
          ? 'flex items-end'
          : '',
      }),
      makeMenuColumn<ActivityFeedColonyAction>({
        helper,
        getMenuProps,
        cellProps: {
          staticSize: isRecentActivityVariant ? '2rem' : '3rem',
        },
      }),
      helper.display({
        id: EXPANDER_COLUMN_ID,
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
  }, [
    isMobile,
    isRecentActivityVariant,
    loading,
    loadingMotionStates,
    refetchMotionStates,
    showUserAvatar,
    getMenuProps,
  ]);
};

export default useColonyActionsTableColumns;
