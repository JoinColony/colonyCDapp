import { BigNumber } from 'ethers';
import React from 'react';
import { defineMessages } from 'react-intl';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useSearchStreamingPaymentsQuery } from '~gql';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { convertToMonthlyAmount } from '~utils/streamingPayments.ts';
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
  const {
    colony: { nativeToken, colonyAddress },
  } = useColonyContext();
  const { data, loading } = useSearchStreamingPaymentsQuery({
    variables: {
      colonyId: colonyAddress,
    },
  });

  const groupedStreamingPayments: StreamingTableFieldModel[] = (
    data?.searchStreamingPayments?.items || []
  )
    .filter(notNull)
    .map((item) => ({
      title: item.actions?.items[0]?.metadata?.customTitle || '',
      token: item.token || nativeToken,
      nativeDomainId: item.nativeDomainId,
      paymentId: item.id,
      amount: item.amount,
      creatorAddress: item.creatorAddress,
      recipientAddress: item.recipientAddress,
      interval: item.interval,
      transactionId: item.actions?.items[0]?.transactionHash || '',
    }))
    .reduce<StreamingTableFieldModel[]>((result, item) => {
      const { recipientAddress } = item;

      let existingEntryIndex = result.findIndex((entry) => {
        return entry.user === recipientAddress;
      });

      if (existingEntryIndex < 0) {
        result.push({
          user: recipientAddress,
          userStreams: [],
          actions: [],
        });
        existingEntryIndex = result.length - 1;
      }

      const existingUser = result[existingEntryIndex];
      const tokenAddress = item.token?.tokenAddress || '';

      let userStreamIndex = existingUser.userStreams.findIndex(
        (stream) => stream.tokenAddress === tokenAddress,
      );

      if (userStreamIndex < 0) {
        existingUser.userStreams.push({
          tokenAddress,
          amount: '0',
          tokenDecimals: item.token?.decimals || DEFAULT_TOKEN_DECIMALS,
          tokenSymbol: item.token?.symbol || '',
        });
        userStreamIndex = existingUser.userStreams.length - 1;
      }

      const monthlyAmount = convertToMonthlyAmount(
        BigNumber.from(item.amount),
        Number(item.interval),
      );

      const currentStream = existingUser.userStreams[userStreamIndex];
      const totalAmount = BigNumber.from(currentStream.amount)
        .add(monthlyAmount)
        .toString();

      existingUser.userStreams[userStreamIndex] = {
        ...currentStream,
        amount: totalAmount,
      };

      existingUser.actions = [...existingUser.actions, item];

      return result;
    }, []);

  const columns = useStreamingTableColumns(loading);
  const renderSubComponent = useRenderSubComponent();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">{formatText(MSG.title)}</h2>
      </div>
      <Table<StreamingTableFieldModel>
        className="[&_table]:table-auto lg:[&_table]:table-fixed [&_tbody_td]:h-[54px] [&_td:first-child]:pl-4 [&_td]:border-gray-100 [&_td]:pr-4 [&_th]:border-none [&_tr.expanded-below+tr_td]:pl-0 [&_tr.expanded-below+tr_td]:pr-0 [&_tr.expanded-below_td]:border-gray-200 [&_tr:not(:last-child)_td]:border-b"
        data={loading ? Array(4).fill({}) : groupedStreamingPayments}
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
