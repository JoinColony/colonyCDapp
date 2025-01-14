import {
  ArrowSquareOut,
  Bank,
  Binoculars,
  HandCoins,
  PlusCircle,
  Share,
} from '@phosphor-icons/react';
import {
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { uniqueId } from 'lodash';
import React, { type FC, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Action } from '~constants/actions.ts';
import { DEFAULT_NETWORK_INFO } from '~constants/index.ts';
import {
  ActionSidebarMode,
  useActionSidebarContext,
} from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { getBlockExplorerLink } from '~utils/external/index.ts';
import { formatText } from '~utils/intl.ts';
// import { useSearchContext } from '~context/SearchContext';
// import Filter from '~v5/common/Filter';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import { AddFundsModal } from '~v5/common/Modals/AddFundsModal/AddFundsModal.tsx';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/Table/consts.ts';
import { Table } from '~v5/common/Table/Table.tsx';
import TableHeader from '~v5/common/TableHeader/TableHeader.tsx';
import Link from '~v5/shared/Link/index.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import BalanceFilters from './Filters/BalanceFilters/BalanceFilters.tsx';
import { useBalanceTableColumns, useBalancesData } from './hooks.tsx';
import { type BalanceTableFieldModel } from './types.ts';

const displayName = 'v5.pages.BalancePage.partials.BalaceTable';

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

const BalanceTable: FC = () => {
  const data = useBalancesData();
  const {
    colony: { nativeToken, status },
  } = useColonyContext();
  const { nativeToken: nativeTokenStatus } = status || {};
  const isMobile = useMobile();
  // const { searchValue } = useSearchContext();
  const [sorting, setSorting] = useState<SortingState>([
    { desc: true, id: 'balance' },
  ]);
  const [rowSelection, setRowSelection] = useState({});
  const tokensDataLength = data?.length;
  const { formatMessage } = useIntl();
  const { showActionSidebar } = useActionSidebarContext();
  const [
    isAddFundsModalOpened,
    { toggleOn: toggleAddFundsModalOn, toggleOff: toggleAddFundsModalOff },
  ] = useToggle();

  const getMenuProps: (
    row: Row<BalanceTableFieldModel>,
  ) => MeatBallMenuProps | undefined = ({
    original: { token: selectedTokenData, loading },
  }) => {
    if (loading) return undefined;

    const isTokenNative =
      selectedTokenData?.tokenAddress === nativeToken?.tokenAddress;

    return {
      cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
      contentWrapperClassName: clsx('sm:min-w-[17.375rem]', {
        '!left-6 right-6': isMobile,
      }),
      dropdownPlacementProps: { withAutoTopPlacement: isMobile },
      items: [
        ...(!isTokenNative && !nativeTokenStatus?.unlocked
          ? [
              {
                key: 'add_funds',
                onClick: () => {
                  toggleAddFundsModalOn();
                },
                label: formatMessage(MSG.labelAddFunds),
                icon: PlusCircle,
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
          label: formatText(
            { id: 'balancePage.labelEthscan.viewOn' },
            {
              networkName: DEFAULT_NETWORK_INFO.blockExplorerName,
            },
          ),
          icon: ArrowSquareOut,
        },
        ...(isTokenNative && nativeTokenStatus?.mintable
          ? [
              {
                key: 'mint_tokens',
                onClick: () => {
                  showActionSidebar(ActionSidebarMode.CreateAction, {
                    action: Action.MintTokens,
                  });
                },
                label: formatMessage(MSG.labelMintToken),
                icon: Bank,
              },
            ]
          : []),
        {
          key: 'transfer_funds',
          onClick: () => {
            showActionSidebar(ActionSidebarMode.CreateAction, {
              action: Action.TransferFunds,
              initialValues: {
                tokenAddress: selectedTokenData?.tokenAddress,
              },
            });
          },
          label: formatMessage(MSG.labelTransferFunds),
          icon: Share,
        },
        {
          key: 'make_payment',
          onClick: () => {
            showActionSidebar(ActionSidebarMode.CreateAction, {
              action: Action.SimplePayment,
              initialValues: {
                tokenAddress: selectedTokenData?.tokenAddress,
              },
            });
          },
          label: formatMessage(MSG.labelMakePayment),
          icon: HandCoins,
        },
      ],
    };
  };

  const columns = useBalanceTableColumns(
    nativeToken,
    nativeTokenStatus,
    getMenuProps,
  );

  const hasPagination = data.length >= 10;

  return (
    <>
      <TableHeader title={formatText({ id: 'balancePage.table.title' })}>
        <BalanceFilters toggleAddFundsModalOn={toggleAddFundsModalOn} />
      </TableHeader>
      <Table<BalanceTableFieldModel>
        overrides={{
          getRowId: ({ token }) => (token ? token.tokenAddress : uniqueId()),
          state: {
            sorting,
            rowSelection,
            columnVisibility: {
              type: !isMobile,
            },
          },
          initialState: {
            pagination: {
              pageIndex: 0,
              pageSize: 10,
            },
          },
          onSortingChange: setSorting,
          onRowSelectionChange: setRowSelection,
          getSortedRowModel: getSortedRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
        }}
        className={clsx({
          'pb-4': hasPagination,
        })}
        columns={columns}
        data={data || []}
        pagination={{
          visible: hasPagination,
          pageNumberVisible: true,
        }}
        emptyContent={
          !tokensDataLength && (
            <EmptyContent
              icon={Binoculars}
              title={{ id: 'balancePage.table.emptyTitle' }}
              description={{ id: 'balancePage.table.emptyDescription' }}
              withoutButtonIcon
              className="px-6 pb-9 pt-10"
            />
          )
        }
        renderCellWrapper={(className, content, { cell }) => (
          <div
            className={clsx(
              className,
              'min-h-[4.25rem] !py-[0.1rem] md:min-h-[3.625rem]',
              {
                'pl-0 md:pl-[1.1rem]':
                  cell.column.columnDef.id === MEATBALL_MENU_COLUMN_ID,
                'pl-0 pr-2':
                  cell.column.columnDef.id &&
                  ['balance', 'symbol'].includes(cell.column.columnDef.id) &&
                  isMobile,
                'pr-2': cell.column.columnDef.id === 'asset' && isMobile,
              },
            )}
          >
            {content}
          </div>
        )}
      />

      <AddFundsModal
        isOpen={isAddFundsModalOpened}
        onClose={toggleAddFundsModalOff}
      />
    </>
  );
};

BalanceTable.displayName = displayName;

export default BalanceTable;
