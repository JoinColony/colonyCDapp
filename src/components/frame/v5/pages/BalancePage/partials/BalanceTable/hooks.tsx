import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import React, { useCallback, useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { ACTION } from '~constants/actions.ts';
import { DEFAULT_NETWORK_INFO } from '~constants/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/index.tsx';
import { NativeTokenStatus } from '~gql';
import CurrencyConversion from '~shared/CurrencyConversion/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { Token } from '~types/graphql.ts';
import { getBlockExplorerLink } from '~utils/external/index.ts';
import { formatText } from '~utils/intl.ts';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.tsx';
import TokenTypeBadge from '~v5/common/Pills/TokenTypeBadge/index.ts';
import { TOKEN_TYPE } from '~v5/common/Pills/TokenTypeBadge/types.ts';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types.ts';
import Link from '~v5/shared/Link/index.ts';

import TokenAvatar from '../TokenAvatar/index.ts';

import { BalanceTableFieldModel } from './types.ts';

const displayName = 'v5.pages.BalancePage.partials.BalaceTable.hooks';

const MSG = defineMessages({
  labelAddFunds: {
    id: `${displayName}.labelAddFunds`,
    defaultMessage: 'Add funds',
  },
  labelMintToken: {
    id: `${displayName}.labelMintToken`,
    defaultMessage: 'Mint tokens',
  },
  labelTransferFunds: {
    id: `${displayName}.transferFunds`,
    defaultMessage: 'Transfer funds',
  },
  labelMakePayment: {
    id: `${displayName}.makePayment`,
    defaultMessage: 'Make payment using this token',
  },
});

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
              <CurrencyConversion
                tokenBalance={currentTokenBalance}
                contractAddress={row.original.token?.tokenAddress ?? ''}
                className="text-gray-600 !text-sm"
              />
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
  const { formatMessage } = useIntl();
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
                  label: formatMessage(MSG.labelAddFunds),
                  icon: 'add',
                },
              ]
            : []),
          {
            key: 'view_ethscan',
            renderItemWrapper: (props, children) => (
              <Link
                to={getBlockExplorerLink({
                  linkType: 'address',
                  addressOrHash: selectedTokenData?.tokenAddress || '',
                })}
                {...props}
              >
                {children}
              </Link>
            ),
            label: formatText(
              { id: 'balancePage.labelEthscan.viewOn' },
              {
                networkName: DEFAULT_NETWORK_INFO.blockExplorerName,
              },
            ),
            icon: 'arrow-square-out',
          },
          ...(isTokenNative
            ? [
                {
                  key: 'mint_tokens',
                  onClick: () => {
                    toggleActionSidebarOn({
                      [ACTION_TYPE_FIELD_NAME]: ACTION.MINT_TOKENS,
                    });
                  },
                  label: formatMessage(MSG.labelMintToken),
                  icon: 'bank',
                },
              ]
            : []),
          {
            key: 'transfer_funds',
            onClick: () => {
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.TRANSFER_FUNDS,
                amount: {
                  tokenAddress: selectedTokenData?.tokenAddress,
                },
              });
            },
            label: formatMessage(MSG.labelTransferFunds),
            icon: 'transfer',
          },
          {
            key: 'make_payment',
            onClick: () => {
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.SIMPLE_PAYMENT,
                amount: {
                  tokenAddress: selectedTokenData?.tokenAddress,
                },
              });
            },
            label: formatMessage(MSG.labelMakePayment),
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
      formatMessage,
    ],
  );

  return {
    getMenuProps,
  };
};
