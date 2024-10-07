import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React from 'react';
import { defineMessages } from 'react-intl';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useGetStreamingPaymentsQuery } from '~gql';
import { formatText } from '~utils/intl.ts';
import { getAmountPerValue } from '~utils/streamingPayments.ts';
import Table from '~v5/common/Table/Table.tsx';

import { useRenderSubComponent, useStreamingTableColumns } from './hooks.tsx';
import { type StreamingTableFieldModel } from './types.ts';

const displayName =
  'pages.StreamingPaymentsPage.partials.StreamingPaymentsTable';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Streaming Payments',
  },
});

const StreamingPaymentsTable = () => {
  const { data, loading } = useGetStreamingPaymentsQuery();
  const streamingPayments: StreamingTableFieldModel[] = (
    data?.searchStreamingPayments?.items || []
  ).reduce<StreamingTableFieldModel[]>((result, item) => {
    if (!item) {
      return result;
    }

    const { recipientAddress } = item;

    let existingEntryIndex = result.findIndex((entry) => {
      return entry.user === recipientAddress;
    });

    const actionData = {
      title: item.actions?.items[0]?.metadata?.customTitle || '',
      token: {
        symbol: item.token?.symbol || '',
        address: item.tokenAddress,
        decimals: item.token?.decimals || DEFAULT_TOKEN_DECIMALS,
      },
      team: item.nativeDomainId,
      paymentId: item.id,
      streamed: item.amount,
      initiator: item.creatorAddress,
      recipient: item.recipientAddress,
      period: getAmountPerValue(item.interval).toLowerCase(),
      transactionId: item.actions?.items[0]?.transactionHash || '',
    };

    if (existingEntryIndex < 0) {
      result.push({
        user: recipientAddress,
        userStreams: {
          amount: '0',
          tokenAddress: item.tokenAddress,
          tokenDecimals: item.token?.decimals || DEFAULT_TOKEN_DECIMALS,
        },
        actions: [],
      });

      existingEntryIndex = result.length - 1;
    }

    const totalAmount = BigNumber.from(
      result[existingEntryIndex].userStreams.amount,
    )
      .add(BigNumber.from(item.amount))
      .toString();

    const actions = [...result[existingEntryIndex].actions, actionData];

    const updatedResult = [...result];
    updatedResult[existingEntryIndex] = {
      ...updatedResult[existingEntryIndex],
      actions,
      userStreams: {
        amount: totalAmount,
        tokenAddress: item.tokenAddress,
        tokenDecimals: item.token?.decimals || DEFAULT_TOKEN_DECIMALS,
      },
    };

    return updatedResult;
  }, []);

  const columns = useStreamingTableColumns();
  const renderSubComponent = useRenderSubComponent();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">{formatText(MSG.title)}</h2>
      </div>
      <Table<StreamingTableFieldModel>
        className={clsx(
          '[&_table]:table-auto lg:[&_table]:table-fixed [&_tbody_td]:h-[54px] [&_td:first-child]:pl-4 [&_td]:border-gray-100 [&_td]:pr-4 [&_th]:border-none [&_tr.expanded-below+tr_td]:pl-0 [&_tr.expanded-below+tr_td]:pr-0 [&_tr:not(:last-child)_td]:border-b',
          {},
        )}
        data={loading ? [] : streamingPayments}
        columns={columns}
        renderCellWrapper={(_, content) => content}
        withBorder={false}
        renderSubComponent={renderSubComponent}
      />
    </div>
  );
};

StreamingPaymentsTable.displayName = displayName;

export default StreamingPaymentsTable;
