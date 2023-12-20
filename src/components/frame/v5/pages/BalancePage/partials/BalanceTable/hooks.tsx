import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DeepPartial } from 'utility-types';
import { formatText } from '~utils/intl';
import Numeral, { getFormattedNumeralValue } from '~shared/Numeral';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import { getBlockExplorerLink } from '~utils/external';
import { ACTION } from '~constants/actions';
import { DEFAULT_NETWORK_INFO } from '~constants';
import { NativeTokenStatus } from '~gql';
import { Token } from '~types';
import { useActionSidebarContext } from '~context';
import { useColonyContext } from '~hooks';
import { useGetSelectedTeamFilter } from '~hooks/useTeamsBreadcrumbs';
import { convertToDecimal } from '~utils/convertToDecimal';
import TokenIcon from '~shared/TokenIcon';
import { FiltersProps } from '~v5/shared/Filters/types';
import TokenTypeBadge from '~v5/common/Pills/TokenTypeBadge';
import { TOKEN_TYPE } from '~v5/common/Pills/TokenTypeBadge/types';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts';
import Link from '~v5/shared/Link';
import TokenAvatar from '../TokenAvatar';
import {
  BalanceTableFieldModel,
  BalanceTableFilters,
  TokensDataProps,
  TokensProps,
  UseFundsTableReturnType,
} from './types';

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
  filterTokenType: {
    id: `${displayName}.filterTokenType`,
    defaultMessage: 'Token type',
  },
  filterApprovedTokens: {
    id: `${displayName}.filterApprovedTokens`,
    defaultMessage: 'Approved token types',
  },
  filterAttributes: {
    id: `${displayName}.filterAttributes`,
    defaultMessage: 'Attributes',
  },
  filterAttributeTypes: {
    id: `${displayName}.filterAttributeTypes`,
    defaultMessage: 'Attribute types',
  },
  typeNative: {
    id: `${displayName}.typeNative`,
    defaultMessage: 'Native',
  },
  typeReputation: {
    id: `${displayName}.typeReputation`,
    defaultMessage: 'Reputation',
  },
  tableRowType: {
    id: `${displayName}.tableRowType`,
    defaultMessage: 'Type',
  },
  tableRowSymbol: {
    id: `${displayName}.tableRowSymbol`,
    defaultMessage: 'Symbol',
  },
  tableRowAttribute: {
    id: `${displayName}.tableRowAttribute`,
    defaultMessage: 'Attribute',
  },
  tableRowBalance: {
    id: `${displayName}.tableRowBalance`,
    defaultMessage: 'Balance',
  },
  customLabel: {
    id: `${displayName}.customLabel`,
    defaultMessage: 'All filters',
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
        id: 'type',
        header: () => formatText(MSG.tableRowType),
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
        header: () => formatText(MSG.tableRowSymbol),
        cell: ({ row }) => (
          <span className="text-gray-600">{row.original.token?.symbol}</span>
        ),
      }),
      columnHelper.display({
        id: 'attribute',
        size: 130,
        header: () => formatText(MSG.tableRowAttribute),
        cell: ({ row }) => {
          const isTokenNative =
            row.original.token?.tokenAddress === nativeToken.tokenAddress;
          return (
            <span className="hidden sm:flex">
              {isTokenNative && (
                <TokenTypeBadge tokenType={TOKEN_TYPE.native}>
                  {formatText(MSG.typeNative)}
                </TokenTypeBadge>
              )}
            </span>
          );
        },
      }),
      columnHelper.accessor('balance', {
        header: () => formatText(MSG.tableRowBalance),
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
  toggleAddFundsModalOn: () => void,
  searchedTokens?: TokensProps[],
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
      const selectedTokenData = searchedTokens?.[index]?.token;
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
      searchedTokens,
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

export const useBalanceTable = (): UseFundsTableReturnType => {
  const { colony } = useColonyContext();
  const selectedTeam = useGetSelectedTeamFilter();
  const { balances, nativeToken } = colony || {};
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState<
    DeepPartial<BalanceTableFilters>
  >({
    type: {},
    attribute: {
      native: false,
      reputation: false,
    },
  });

  const tokensData: TokensDataProps[] | undefined = useMemo(
    () =>
      colony?.tokens?.items.map((item) => {
        const currentTokenBalance =
          getBalanceForTokenAndDomain(
            balances,
            item?.token?.tokenAddress || '',
            selectedTeam ? Number(selectedTeam.nativeId) : undefined,
          ) || 0;
        const decimals = getTokenDecimalsWithFallback(item?.token.decimals);
        const convertedValue = convertToDecimal(
          currentTokenBalance,
          decimals || 0,
        );

        const formattedValue = getFormattedNumeralValue(
          convertedValue,
          currentTokenBalance,
        );

        return {
          ...item,
          balance: typeof formattedValue === 'string' ? formattedValue : '',
        };
      }),
    [colony, balances, selectedTeam],
  );

  const sortedTokens = useMemo(
    () =>
      tokensData?.sort((a, b) => {
        if (!a.balance || !b.balance) return 0;
        return parseInt(b.balance, 10) - parseInt(a.balance, 10);
      }),
    [tokensData],
  );

  const filteredTokens: FiltersProps<BalanceTableFilters> = {
    onChange: setFilterValue,
    onSearch: setSearchValue,
    searchValue,
    value: filterValue,
    customLabel: formatText(MSG.customLabel),
    items: [
      {
        name: 'type',
        label: formatText(MSG.filterTokenType),
        title: formatText(MSG.filterApprovedTokens),
        icon: 'coin-vertical',
        items: sortedTokens
          ? sortedTokens.map(({ token }) => ({
              name: token?.tokenAddress || '',
              label: token && (
                <div className="flex items-center gap-2">
                  <TokenIcon token={token} size="xxxs" />
                  {token.symbol}
                </div>
              ),
            }))
          : [],
      },
      {
        name: 'attribute',
        label: formatText(MSG.filterAttributes),
        title: formatText(MSG.filterAttributeTypes),
        icon: 'folder-simple-lock',
        items: [
          {
            name: 'native',
            label: formatText(MSG.typeNative),
          },
          {
            name: 'reputation',
            label: formatText(MSG.typeReputation),
          },
        ],
      },
    ],
  };

  const filterTokensByType = (
    visibleToken: TokensProps,
    type:
      | DeepPartial<{
          [key: string]: boolean;
        }>
      | undefined,
  ) => {
    if (type) {
      return Object.values(type).some((tokenTypeFilter) => tokenTypeFilter)
        ? type[visibleToken?.token?.tokenAddress || 0]
        : true;
    }
    return visibleToken;
  };

  const filterTokensByAttribute = (
    visibleToken: TokensProps,
    attribute:
      | DeepPartial<{
          native: boolean;
          reputation: boolean;
        }>
      | undefined,
  ) => {
    return Object.values(attribute || {}).some(
      (attributeTypeFilter) => attributeTypeFilter,
    )
      ? (attribute?.native && visibleToken.isNative) ||
          (attribute?.reputation && !visibleToken.isNative)
      : visibleToken;
  };

  const tokens: TokensProps[] | undefined = sortedTokens?.map((token) => ({
    ...token,
    isApproved: sortedTokens?.some(
      ({ token: colonyTokens }) =>
        colonyTokens?.tokenAddress === token?.token?.tokenAddress,
    ),
    isNative: token.token?.tokenAddress === nativeToken?.tokenAddress,
  }));

  const visibleTokens: TokensProps[] | undefined = tokens
    ?.filter((visibleToken) =>
      filterTokensByType(visibleToken, filterValue.type),
    )
    .filter((visibleToken) =>
      filterTokensByAttribute(visibleToken, filterValue.attribute),
    );

  const searchedTokens = visibleTokens?.filter(
    ({ token }) =>
      token?.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      token?.symbol.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return { filteredTokens, searchedTokens };
};
