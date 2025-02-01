import { CaretDown } from '@phosphor-icons/react';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { formatText } from '~utils/intl.ts';
import StreamingPaymentStatusPill from '~v5/common/ActionSidebar/partials/StreamingPaymentStatusPill/StreamingPaymentStatusPill.tsx';

import { type StreamingActionTableFieldModel } from '../StreamingPaymentsTable/types.ts';

import TeamField from './partials/TeamField/TeamField.tsx';
import TitleField from './partials/TitleField/TitleField.tsx';

export const useStreamingActionsTableColumns = () => {
  return useMemo(() => {
    const helper = createColumnHelper<StreamingActionTableFieldModel>();

    return [
      helper.display({
        id: 'title',
        enableSorting: false,
        cell: ({ row }) => (
          <TitleField
            title={row.original.title}
            tokenSymbol={row.original.token?.symbol || ''}
            amount={row.original.amount}
            initiator={row.original.creatorAddress}
            recipient={row.original.recipientAddress}
            period={row.original.interval}
            decimals={row.original.token?.decimals || DEFAULT_TOKEN_DECIMALS}
            hideDescription={row.getIsExpanded()}
          />
        ),
        colSpan: (isExpanded) => (isExpanded ? 3 : undefined),
        header: formatText({ id: 'streamingPayment.table.description' }),
      }),
      helper.accessor('totalStreamedAmount', {
        id: 'totalStreamedAmount',
        staticSize: '7rem',
        enableSorting: true,
        cell: ({ row }) => (
          <Numeral
            className="text-md text-gray-600"
            value={row.original.totalStreamedAmount}
            decimals={row.original.token?.decimals || DEFAULT_TOKEN_DECIMALS}
          />
        ),
        colSpan: (isExpanded) => (isExpanded ? 0 : undefined),
        header: formatText({ id: 'streamingPayment.table.streamed' }),
      }),
      helper.accessor('token.symbol', {
        id: 'token',
        staticSize: '5rem',
        enableSorting: true,
        cell: ({ row }) => (
          <p className="text-md text-gray-600">
            {row.original.token?.symbol || ''}
          </p>
        ),
        colSpan: (isExpanded) => (isExpanded ? 0 : undefined),
        header: formatText({ id: 'streamingPayment.table.token' }),
      }),
      helper.accessor('nativeDomainId', {
        id: 'team',
        staticSize: '8.125rem',
        enableSorting: true,
        cell: ({ row }) => <TeamField domainId={row.original.nativeDomainId} />,
        header: formatText({ id: 'streamingPayment.table.team' }),
      }),
      helper.display({
        id: 'status',
        staticSize: '7.5rem',
        enableSorting: false,
        cell: ({ row }) => (
          <StreamingPaymentStatusPill status={row.original.status} />
        ),
        header: formatText({ id: 'streamingPayment.table.status' }),
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
  }, []);
};
