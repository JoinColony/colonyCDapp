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
  type SortingState,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { uniqueId } from 'lodash';
import React, { type FC, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { CoreAction } from '~actions/index.ts';
import { DEFAULT_NETWORK_INFO } from '~constants/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { getBlockExplorerLink } from '~utils/external/index.ts';
import { formatText } from '~utils/intl.ts';
// import { useSearchContext } from '~context/SearchContext';
// import Filter from '~v5/common/Filter';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/Table/consts.ts';
import Table from '~v5/common/Table/index.ts';
import { type TableProps } from '~v5/common/Table/types.ts';
import TableHeader from '~v5/common/TableHeader/TableHeader.tsx';
import Button from '~v5/shared/Button/index.ts';
import CopyWallet from '~v5/shared/CopyWallet/index.ts';
import Link from '~v5/shared/Link/index.ts';

import BalanceModal from '../BalanceModal/index.ts';

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
    colony: { nativeToken, status, colonyAddress },
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
  const { show } = useActionSidebarContext();
  const [
    isAddFundsModalOpened,
    { toggleOn: toggleAddFundsModalOn, toggleOff: toggleAddFundsModalOff },
  ] = useToggle();
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  const columns = useBalanceTableColumns(nativeToken, nativeTokenStatus);
  const getMenuProps: TableProps<BalanceTableFieldModel>['getMenuProps'] = ({
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
                  show({
                    [ACTION_TYPE_FIELD_NAME]: CoreAction.MintTokens,
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
            show({
              [ACTION_TYPE_FIELD_NAME]: CoreAction.MoveFunds,
              tokenAddress: selectedTokenData?.tokenAddress,
            });
          },
          label: formatMessage(MSG.labelTransferFunds),
          icon: Share,
        },
        {
          key: 'make_payment',
          onClick: () => {
            show({
              [ACTION_TYPE_FIELD_NAME]: CoreAction.Payment,
              tokenAddress: selectedTokenData?.tokenAddress,
            });
          },
          label: formatMessage(MSG.labelMakePayment),
          icon: HandCoins,
        },
      ],
    };
  };

  return (
    <>
      <TableHeader title={formatText({ id: 'balancePage.table.title' })}>
        <BalanceFilters />
        <Button
          mode="primarySolid"
          onClick={toggleAddFundsModalOn}
          size="small"
        >
          {formatText({ id: 'balancePage.table.addFunds' })}
        </Button>
      </TableHeader>
      <Table<BalanceTableFieldModel>
        getRowId={({ token }) => (token ? token.tokenAddress : uniqueId())}
        columns={columns}
        data={data || []}
        state={{
          sorting,
          rowSelection,
          columnVisibility: {
            type: !isMobile,
          },
        }}
        initialState={{
          pagination: {
            pageSize: 10,
          },
        }}
        showPageNumber={data.length >= 10}
        onSortingChange={setSorting}
        onRowSelectionChange={setRowSelection}
        getSortedRowModel={getSortedRowModel()}
        getPaginationRowModel={getPaginationRowModel()}
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
        getMenuProps={getMenuProps}
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
        meatBallMenuStaticSize={isMobile ? '2.25rem' : undefined}
      />
      <BalanceModal
        isOpen={isAddFundsModalOpened}
        onClose={toggleAddFundsModalOff}
      >
        <>
          <h5 className="mb-1.5 heading-5">
            {formatText({ id: 'balancePage.modal.title' })}
          </h5>
          <p className="mb-6 text-md text-gray-600">
            {formatText({ id: 'balancePage.modal.subtitle' })}
          </p>
          <CopyWallet
            isCopied={isCopied}
            handleClipboardCopy={() => handleClipboardCopy(colonyAddress || '')}
            value={colonyAddress || ''}
          />
        </>
      </BalanceModal>
    </>
  );
};

BalanceTable.displayName = displayName;

export default BalanceTable;
