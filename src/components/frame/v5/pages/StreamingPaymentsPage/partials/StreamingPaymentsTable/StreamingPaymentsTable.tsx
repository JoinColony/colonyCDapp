import { Binoculars } from '@phosphor-icons/react';
import { getPaginationRowModel } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import React, { useMemo } from 'react';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { StreamingPaymentStatus } from '~types/streamingPayments.ts';
import { notNull } from '~utils/arrays/index.ts';
import {
  convertToMonthlyAmount,
  getStreamingPaymentAmountsLeft,
  getStreamingPaymentStatus,
} from '~utils/streamingPayments.ts';
import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';
import Table from '~v5/common/Table/Table.tsx';

import { useStreamingFiltersContext } from './FiltersContext/StreamingFiltersContext.ts';
import {
  useRenderSubComponent,
  useStreamingPaymentTable,
  useStreamingTableColumns,
} from './hooks.tsx';
import { type StreamingTableFieldModel } from './types.ts';
import { searchStreamingPayments } from './utils.ts';

const displayName =
  'pages.StreamingPaymentsPage.partials.StreamingPaymentsTable';

const StreamingPaymentsTable = () => {
  const {
    colony: { nativeToken },
  } = useColonyContext();
  const { items, loading } = useStreamingPaymentTable();
  const { currentBlockTime: blockTime } = useCurrentBlockTime();
  const { searchFilter, selectedFiltersCount } = useStreamingFiltersContext();
  const { totalMembers: members } = useMemberContext();

  const groupedStreamingPayments: StreamingTableFieldModel[] = items
    .filter(notNull)
    .map((item) => {
      const { amountAvailableToClaim } = getStreamingPaymentAmountsLeft(
        item,
        Math.floor(blockTime ?? Date.now() / 1000),
      );
      const paymentStatus = getStreamingPaymentStatus({
        streamingPayment: item,
        currentTimestamp: Math.floor(blockTime ?? Date.now() / 1000),
        amountAvailableToClaim,
      });

      return {
        title: item.actions?.items[0]?.metadata?.customTitle || '',
        token: item.token || nativeToken,
        nativeDomainId: item.nativeDomainId,
        paymentId: item.id,
        amount: item.amount,
        creatorAddress: item.creatorAddress,
        recipientAddress: item.recipientAddress,
        interval: item.interval,
        transactionId: item.actions?.items[0]?.transactionHash || '',
        id: item.id,
        nativeId: item.nativeId,
        startTime: item.startTime,
        endTime: item.endTime,
        tokenAddress: item.tokenAddress,
        createdAt: item.createdAt,
        status: paymentStatus,
      };
    })
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

      const isPaymentActive = item.status === StreamingPaymentStatus.Active;

      if (isPaymentActive) {
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
      }

      existingUser.actions = [...existingUser.actions, item];

      return result;
    }, []);

  const searchedStreamingPayments = useMemo(
    () =>
      searchStreamingPayments(groupedStreamingPayments, members, searchFilter),
    [groupedStreamingPayments, searchFilter, members],
  );

  const columns = useStreamingTableColumns(loading);
  const renderSubComponent = useRenderSubComponent();

  return (
    <Table<StreamingTableFieldModel>
      className="[&_table]:table-auto lg:[&_table]:table-fixed [&_tbody_td]:h-[54px] [&_td:first-child]:pl-4 [&_td]:border-gray-100 [&_td]:pr-4 [&_th]:border-none [&_tr.expanded-below+tr_td]:pl-0 [&_tr.expanded-below+tr_td]:pr-0 [&_tr.expanded-below_td]:border-gray-200 [&_tr:not(:last-child)_td]:border-b"
      data={loading ? Array(4).fill({}) : searchedStreamingPayments}
      columns={columns}
      renderCellWrapper={(_, content) => content}
      withBorder={false}
      renderSubComponent={renderSubComponent}
      paginationDisabled={loading}
      showTotalPagesNumber={false}
      getPaginationRowModel={getPaginationRowModel()}
      initialState={{
        pagination: {
          pageSize: 10,
        },
      }}
      emptyContent={
        <EmptyContent
          icon={Binoculars}
          title={{ id: 'streamingPayment.table.emptyContent.title' }}
          description={{
            id:
              searchFilter || selectedFiltersCount
                ? 'streamingPayment.table.emptyContent.search.description'
                : 'streamingPayment.table.emptyContent.description',
          }}
          withoutButtonIcon
          className="px-6 pb-9 pt-10"
        />
      }
    />
  );
};

StreamingPaymentsTable.displayName = displayName;

export default StreamingPaymentsTable;
