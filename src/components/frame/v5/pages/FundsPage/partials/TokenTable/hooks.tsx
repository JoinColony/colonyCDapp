import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import React, { useCallback, useMemo } from 'react';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { ActionTypes } from '~redux';
import Numeral from '~shared/Numeral/index.ts';
import { type ColonyClaims } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';

import AcceptButton from '../AcceptButton/index.ts';

export const useTokenTableColumns = (): ColumnDef<ColonyClaims, string>[] => {
  const columnHelper = useMemo(() => createColumnHelper<ColonyClaims>(), []);

  const getClaimButtonCell = useCallback((claim: ColonyClaims) => {
    if (claim.isClaimed) {
      return (
        <p className="w-full text-right text-sm text-gray-400">
          {formatText({ id: 'incomingFundsPage.table.accepted' })}
        </p>
      );
    }

    if (!BigNumber.from(claim.amount).isZero()) {
      const claimChainId = claim.token?.chainMetadata.chainId;
      const isClaimForDefaultNetworkChain =
        !claimChainId || DEFAULT_NETWORK_INFO.chainId === claimChainId;
      return (
        <AcceptButton
          actionType={
            isClaimForDefaultNetworkChain
              ? ActionTypes.CLAIM_TOKEN
              : ActionTypes.PROXY_COLONY_CLAIM_TOKEN
          }
          chainId={claimChainId}
          tokenAddresses={[claim.token?.tokenAddress || '']}
        >
          {formatText({ id: 'button.accept' })}
        </AcceptButton>
      );
    }

    // The claim amount might be zero, for example if there are no native chain token claims (they are still shown even when there is nothing to claim).
    // In this case, don't render anything in this cell.
    return null;
  }, []);

  const columns: ColumnDef<
    ColonyClaims,
    string | boolean | null | undefined
  >[] = useMemo(
    () => [
      columnHelper.accessor('amount', {
        sortingFn: (a, b) => {
          return BigNumber.from(a.original.amount).gt(
            BigNumber.from(b.original.amount),
          )
            ? 1
            : -1;
        },
        header: () => formatText({ id: 'incomingFundsPage.table.amount' }),
        cell: ({ row }) => (
          <Numeral
            value={row.original.amount}
            decimals={row.original.token?.decimals}
            suffix={` ${row.original.token?.symbol}`}
            className="text-gray-900 text-1"
          />
        ),
      }),
      columnHelper.accessor('isClaimed', {
        size: 120,
        sortUndefined: 1,
        invertSorting: true,
        header: () => formatText({ id: 'incomingFundsPage.table.claim' }),
        cell: ({ row }) => {
          return (
            <div className="flex w-full items-center justify-end">
              {getClaimButtonCell(row.original)}
            </div>
          );
        },
      }),
    ],
    [columnHelper, getClaimButtonCell],
  );

  return columns;
};
