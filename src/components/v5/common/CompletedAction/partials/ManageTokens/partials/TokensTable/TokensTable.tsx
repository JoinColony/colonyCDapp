import { getPaginationRowModel } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useTablet } from '~hooks';
import { type ApprovedTokenChanges } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { Table } from '~v5/common/Table/Table.tsx';
import { renderCellContent } from '~v5/common/Table/utils.tsx';
import { TokenStatus } from '~v5/common/types.ts';

import { useTokensTableColumns } from './hooks.tsx';
import { type TokensTableModel } from './types.ts';

const displayName = 'v5.common.CompletedAction.partials.TokensTable';

interface TokensTableProps {
  approvedTokenChanges: ApprovedTokenChanges;
}

const TokensTable = ({ approvedTokenChanges }: TokensTableProps) => {
  const isTablet = useTablet();
  const { colony } = useColonyContext();
  const { added, removed, unaffected } = approvedTokenChanges || {};

  const colonyTokens = useMemo(
    () => colony.tokens?.items.filter(notNull) || [],
    [colony.tokens?.items],
  );

  const blockchainNativeTokenAddress = colonyTokens.find(
    ({ colonyTokensId }) => colonyTokensId === 'DEFAULT_TOKEN_ID',
  )?.token.tokenAddress;

  const mapAddressesToStatus = (
    tokenAddresses: string[],
    status: TokenStatus,
  ) => {
    return tokenAddresses.map((address) => ({ tokenAddress: address, status }));
  };

  const unaffectedTokens = mapAddressesToStatus(
    [
      ...(blockchainNativeTokenAddress ? [blockchainNativeTokenAddress] : []),
      ...unaffected,
    ],
    TokenStatus.Unaffected,
  );
  const addedTokens = mapAddressesToStatus(added, TokenStatus.Added);
  const removedTokens = mapAddressesToStatus(removed, TokenStatus.Removed);

  const combinedTokens = [
    ...unaffectedTokens,
    ...addedTokens,
    ...removedTokens,
  ];

  const columns = useTokensTableColumns(combinedTokens);

  return (
    <div className="mt-4">
      <h5 className="mb-3 text-md font-semibold text-gray-900">
        {formatText({ id: 'actionSidebar.manageTokens.table.title' })}
      </h5>
      <Table<TokensTableModel>
        className={clsx({
          '[&_tbody_td]:h-[3.375rem] [&_td:first-child]:pl-4 [&_td]:pr-4 [&_th:first-child]:pl-4 [&_th:not(:first-child)]:pl-0 [&_th]:pr-4':
            !isTablet,
          'pb-4': combinedTokens.length > 10,
        })}
        columns={columns}
        data={combinedTokens}
        layout={isTablet ? 'vertical' : 'horizontal'}
        renderCellWrapper={renderCellContent}
        borders={{
          visible: true,
          type: 'unset',
        }}
        overrides={{
          initialState: {
            pagination: {
              pageIndex: 0,
              pageSize: 10,
            },
          },
          getPaginationRowModel: getPaginationRowModel(),
        }}
      />
    </div>
  );
};

TokensTable.displayName = displayName;
export default TokensTable;
