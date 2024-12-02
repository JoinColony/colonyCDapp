import { CaretDown } from '@phosphor-icons/react';
import { type Row, createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import StreamingActionsTable from '../StreamingActionsTable/StreamingActionsTable.tsx';

import UserField from './partials/UserField/UserField.tsx';
import UserStreams from './partials/UserStreams/UserStreams.tsx';
import { type StreamingTableFieldModel } from './types.ts';

export const useRenderSubComponent = () => {
  return ({ row }: { row: Row<StreamingTableFieldModel> }) => (
    <StreamingActionsTable actionRow={row} />
  );
};

export const useStreamingTableColumns = (loading: boolean) => {
  return useMemo(() => {
    const helper = createColumnHelper<StreamingTableFieldModel>();

    return [
      helper.display({
        id: 'user',
        staticSize: '100%',
        enableSorting: false,
        header: () => null,
        cell: ({ row }) => (
          <UserField address={row.original.user} isLoading={loading} />
        ),
      }),
      helper.display({
        id: 'amount',
        staticSize: '7.5rem',
        enableSorting: false,
        header: () => null,
        cell: ({ row }) =>
          loading ? (
            <div className="h-5 w-10 skeleton" />
          ) : (
            <UserStreams items={row.original.userStreams} />
          ),
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
  }, [loading]);
};
