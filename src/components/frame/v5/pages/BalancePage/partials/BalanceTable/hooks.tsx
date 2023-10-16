import React, { useCallback, useMemo } from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { formatText } from '~utils/intl';
import Numeral from '~shared/Numeral';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import dispatchGlobalEvent from '~utils/browser/dispatchGlobalEvent';
import { GLOBAL_EVENTS } from '~utils/browser/dispatchGlobalEvent/consts';
import { getBlockExplorerLink } from '~utils/external';
import { ACTION } from '~constants/actions';
import { NativeTokenStatus } from '~gql';
import { Token } from '~types';
import { useActionSidebarContext } from '~context';
import TokenTypeBadge from '~v5/common/Pills/TokenTypeBadge';
import { TOKEN_TYPE } from '~v5/common/Pills/TokenTypeBadge/types';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';
import Link from '~v5/shared/Link';
import TokenAvatar from '../TokenAvatar';
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

export const useGetTableMenuProps = (
  data: BalanceTableFieldModel[],
  toggleAddFundsModalOn: () => void,
  nativeTokenStatus?: NativeTokenStatus | null,
  nativeToken?: Token,
) => {
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const getMenuProps = useCallback<
    TableWithMeatballMenuProps<BalanceTableFieldModel>['getMenuProps']
  >(
    ({ index }) => {
      const selectedTokenData = data[index]?.token;
      const isTokenNative =
        selectedTokenData?.tokenAddress === nativeToken?.tokenAddress;

      return {
        cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
        items: [
          ...(!isTokenNative && !nativeTokenStatus?.unlocked
            ? [
                {
                  key: 'add_funds',
                  onClick: () => {
                    toggleAddFundsModalOn();
                  },
                  label: formatText({
                    id: 'balancePage.burger.label.addFunds',
                  }),
                  icon: 'add',
                },
              ]
            : []),
          {
            key: 'view_ethscan',
            renderItemWrapper: (props, children) => (
              <Link
                to={getBlockExplorerLink({
                  linkType: 'token',
                  addressOrHash: selectedTokenData?.tokenAddress || '',
                })}
                {...props}
              >
                {children}
              </Link>
            ),
            label: formatText({ id: 'balancePage.burger.label.viewEthscan' }),
            icon: 'arrow-square-out',
          },
          ...(isTokenNative
            ? [
                {
                  key: 'mint_tokens',
                  onClick: () => {
                    dispatchGlobalEvent(GLOBAL_EVENTS.SET_ACTION_TYPE, {
                      detail: {
                        actionType: ACTION.MINT_TOKENS,
                      },
                    });
                    toggleActionSidebarOn();
                  },
                  label: formatText({
                    id: 'balancePage.burger.label.mintTokens',
                  }),
                  icon: 'bank',
                },
              ]
            : []),
          {
            key: 'transfer_funds',
            onClick: () => {
              toggleActionSidebarOn();
              dispatchGlobalEvent(GLOBAL_EVENTS.SET_ACTION_TYPE, {
                detail: {
                  actionType: ACTION.TRANSFER_FUNDS,
                },
              });
            },
            label: formatText({ id: 'balancePage.burger.label.transferFunds' }),
            icon: 'transfer',
          },
          {
            key: 'make_payment',
            onClick: () => {
              toggleActionSidebarOn();
              dispatchGlobalEvent(GLOBAL_EVENTS.SET_TOKEN_ADDRESS, {
                detail: {
                  tokenAddress: selectedTokenData?.tokenAddress,
                },
              });
              dispatchGlobalEvent(GLOBAL_EVENTS.SET_ACTION_TYPE, {
                detail: {
                  actionType: ACTION.SIMPLE_PAYMENT,
                },
              });
            },
            label: formatText({ id: 'balancePage.burger.label.makePayment' }),
            icon: 'hand-coins',
          },
        ],
      };
    },
    [
      data,
      toggleActionSidebarOn,
      toggleAddFundsModalOn,
      nativeToken?.tokenAddress,
      nativeTokenStatus,
    ],
  );

  return {
    getMenuProps,
  };
};
