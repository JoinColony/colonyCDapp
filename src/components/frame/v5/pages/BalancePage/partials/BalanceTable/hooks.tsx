import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import React, { useCallback, useMemo } from 'react';
import { formatText } from '~utils/intl';
import Numeral from '~shared/Numeral';
import TokenAvatar from '../TokenAvatar';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import TokenTypeBadge from '~v5/common/Pills/TokenTypeBadge';
import { TOKEN_TYPE } from '~v5/common/Pills/TokenTypeBadge/types';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';
// import Link from '~v5/shared/Link';
// import { DEFAULT_NETWORK_INFO } from '~constants';
// import { getBlockExplorerLink } from '~utils/external';
import { BalanceTableFieldModel } from './types';

export const useBalanceTableColumns = (
  nativeToken,
  balances,
  nativeTokenStatus,
  domainId = 1,
): ColumnDef<BalanceTableFieldModel, string>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<BalanceTableFieldModel>(),
    [],
  );

  const columns: ColumnDef<BalanceTableFieldModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'asset',
        header: () => formatText({ id: 'table.row.asset' }),
        cell: ({ row }) => {
          if (!row.original.token) return [];

          return (
            <TokenAvatar
              token={row.original.token}
              tokenAddress={nativeToken.tokenAddress}
              nativeTokenStatus={nativeTokenStatus}
            />
          );
        },
      }),
      columnHelper.display({
        id: 'symbol',
        size: 100,
        header: () => formatText({ id: 'table.row.symbol' }),
        cell: ({ row }) => (
          <span className="text-gray-600">{row.original.token?.symbol}</span>
        ),
      }),
      columnHelper.display({
        id: 'type',
        size: 130,
        header: () => formatText({ id: 'table.row.type' }),
        cell: ({ row }) => {
          const isTokenNative =
            row.original.token?.tokenAddress === nativeToken.tokenAddress;
          return (
            <span className="hidden sm:flex">
              {isTokenNative && (
                <TokenTypeBadge tokenType={TOKEN_TYPE.native}>
                  {formatText({ id: 'token.type.native' })}
                </TokenTypeBadge>
              )}
            </span>
          );
        },
      }),
      columnHelper.accessor('balance', {
        header: () => formatText({ id: 'table.row.balance' }),
        size: 165,
        cell: ({ row }) => {
          const currentTokenBalance =
            getBalanceForTokenAndDomain(
              balances,
              row.original.token?.tokenAddress || '',
              domainId,
            ) || 0;

          return (
            <div className="flex flex-col justify-center">
              <Numeral
                value={currentTokenBalance}
                decimals={getTokenDecimalsWithFallback(
                  row.original.token?.decimals,
                )}
                className="text-1 text-gray-900"
                suffix={row.original.token?.symbol}
              />
              {/* {row.original.token?.tokenAddress === ADDRESS_ZERO && (
                <EthUsd
                  value={currentTokenBalance}
                  showPrefix
                  className="text-gray-600 !text-sm"
                />
              )} */}
            </div>
          );
        },
      }),
    ],
    [
      columnHelper,
      balances,
      domainId,
      nativeToken.tokenAddress,
      nativeTokenStatus,
    ],
  );

  return columns;
};

export const useGetTableMenuProps = () =>
  useCallback<
    TableWithMeatballMenuProps<BalanceTableFieldModel>['getMenuProps']
  >(() => {
    // @TODO: add actions and translations to every item
    return {
      cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
      items: [
        {
          key: 'add_funds',
          onClick: () => {},
          label: '',
          icon: '',
        },
        // {
        //   key: 'view_ethscan',
        //   onClick: () => {},
        //   icon: 'arrow-square-out',
        //   label: formatText(
        //     { id: 'membersPage.memberNav.viewOn' },
        //     {
        //       networkName: DEFAULT_NETWORK_INFO.blockExplorerName,
        //     },
        //   ),
        //   renderItemWrapper: (props, children) => (
        //     <Link
        //       to={getBlockExplorerLink({
        //         linkType: 'address',
        //         addressOrHash: walletAddress,
        //       })}
        //       {...props}
        //     >
        //       {children}
        //     </Link>
        //   ),
        // },
        // {
        //   key: 'mint_tokens',
        //   onClick: () => {},
        //   label: 'Mint tokens',
        //   icon: 'bank',
        // },
        // {
        //   key: 'transfer_fundss',
        //   onClick: () => {},
        //   label: 'Transfer funds',
        //   icon: 'transfer',
        // },
        // {
        //   key: 'make_payment',
        //   onClick: () => {},
        //   label: 'Make payment with token',
        //   icon: 'hand-coins',
        // },
      ],
    };
  }, []);
