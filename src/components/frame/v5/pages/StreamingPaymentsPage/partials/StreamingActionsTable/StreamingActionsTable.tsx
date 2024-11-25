import { FilePlus, ShareNetwork } from '@phosphor-icons/react';
import { type SortingState, type Row } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useState, type FC } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import MeatballMenuCopyItem from '~common/ColonyActionsTable/partials/MeatballMenuCopyItem/MeatballMenuCopyItem.tsx';
import { APP_URL } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile, useTablet } from '~hooks';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import { formatText } from '~utils/intl.ts';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/Table/consts.ts';
import Table from '~v5/common/Table/Table.tsx';
import { type TableProps } from '~v5/common/Table/types.ts';

import {
  type StreamingTableFieldModel,
  type StreamingActionTableFieldModel,
} from '../StreamingPaymentsTable/types.ts';

import { useStreamingActionsTableColumns } from './hooks.tsx';
import useRenderSubComponent from './partials/StreamingActionMobileItem/hooks.tsx';

interface StreamingActionsTableProps {
  actionRow: Row<StreamingTableFieldModel>;
}

const StreamingActionsTable: FC<StreamingActionsTableProps> = ({
  actionRow,
}) => {
  const {
    colony: { name: colonyName },
  } = useColonyContext();
  const { original } = actionRow;
  const isTablet = useTablet();
  const isMobile = useMobile();
  const columns = useStreamingActionsTableColumns();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'streamed',
      desc: true,
    },
  ]);
  const navigate = useNavigate();
  const getMenuProps: TableProps<StreamingActionTableFieldModel>['getMenuProps'] =
    ({ original: { transactionId } }) => ({
      items: [
        {
          key: '1',
          label: formatText({ id: 'activityFeedTable.menu.view' }),
          icon: FilePlus,
          onClick: () => {
            navigate(
              `${window.location.pathname}?${TX_SEARCH_PARAM}=${transactionId}`,
              {
                replace: true,
              },
            );
          },
        },
        {
          key: '2',
          label: formatText({ id: 'activityFeedTable.menu.share' }),
          renderItemWrapper: (itemWrapperProps, children) => (
            <MeatballMenuCopyItem
              textToCopy={`${APP_URL.origin}/${generatePath(COLONY_HOME_ROUTE, {
                colonyName,
              })}${COLONY_ACTIVITY_ROUTE}?${TX_SEARCH_PARAM}=${transactionId}`}
              {...itemWrapperProps}
            >
              {children}
            </MeatballMenuCopyItem>
          ),
          icon: ShareNetwork,
          onClick: () => false,
        },
      ],
    });

  const renderSubComponent = useRenderSubComponent({
    getMenuProps,
  });

  return (
    <Table<StreamingActionTableFieldModel>
      data={original.actions}
      columns={columns}
      className={clsx(
        '[&_td:first-child]:!pl-0 [&_td]:border-b [&_td]:border-gray-100 [&_td]:!pr-0 [&_th:not(:first-child)]:sm:text-center [&_th]:!rounded-none [&_th]:!border-b [&_th]:!border-solid [&_th]:border-gray-200 [&_tr.expanded-below_td]:border-none [&_tr:last-child_td]:border-none',
        {
          '[&_table]:table-auto lg:[&_table]:table-fixed [&_tbody_td]:h-[54px] [&_th:not(:first-child)]:pl-0':
            !isTablet,
        },
      )}
      enableSortingRemoval={false}
      state={{
        columnVisibility: isMobile
          ? {
              title: true,
              streamed: true,
              token: true,
              team: false,
              status: false,
              [MEATBALL_MENU_COLUMN_ID]: false,
            }
          : {
              expander: false,
            },
        sorting,
      }}
      getMenuProps={getMenuProps}
      onSortingChange={setSorting}
      renderSubComponent={renderSubComponent}
      tableClassName="border-none"
    />
  );
};

export default StreamingActionsTable;
