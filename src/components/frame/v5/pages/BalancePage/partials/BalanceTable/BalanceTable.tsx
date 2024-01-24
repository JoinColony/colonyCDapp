import {
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { uniqueId } from 'lodash';
import React, { type FC, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { ACTION } from '~constants/actions.ts';
import { DEFAULT_NETWORK_INFO } from '~constants/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/index.ts';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { useMobile } from '~hooks/index.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import useToggle from '~hooks/useToggle/index.ts';
import { getBlockExplorerLink } from '~utils/external/index.ts';
import { formatText } from '~utils/intl.ts';
// import { useSearchContext } from '~context/SearchContext';
// import Filter from '~v5/common/Filter';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.tsx';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import Table from '~v5/common/Table/index.ts';
import Button from '~v5/shared/Button/index.ts';
import CopyWallet from '~v5/shared/CopyWallet/index.ts';
import Link from '~v5/shared/Link/index.ts';

import BalanceModal from '../BalanceModal/index.ts';

import { useBalanceTableColumns } from './hooks.tsx';
import {
  type BalanceTableFieldModel,
  type BalanceTableProps,
} from './types.ts';

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

const BalanceTable: FC<BalanceTableProps> = ({ data }) => {
  const selectedDomain = useGetSelectedDomainFilter();
  const {
    colony: { balances, nativeToken, status, colonyAddress },
  } = useColonyContext();
  const { nativeToken: nativeTokenStatus } = status || {};
  const isMobile = useMobile();
  // const { searchValue } = useSearchContext();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const tokensDataLength = data?.length;
  const { formatMessage } = useIntl();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();
  const [
    isAddFundsModalOpened,
    { toggleOn: toggleAddFundsModalOn, toggleOff: toggleAddFundsModalOff },
  ] = useToggle();
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  const columns = useBalanceTableColumns(
    nativeToken,
    balances,
    nativeTokenStatus,
    Number(selectedDomain?.nativeId) || undefined,
  );
  const getMenuProps = ({ index }) => {
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
  };

  return (
    <>
      <Table<BalanceTableFieldModel>
        title={formatText({ id: 'balancePage.table.title' })}
        verticalOnMobile={false}
        hasPagination
        getRowId={({ token }) => (token ? token.tokenAddress : uniqueId())}
        columns={columns}
        data={data || []}
        state={{
          sorting,
          rowSelection,
          columnVisibility: {
            symbol: !isMobile,
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
            <div className="border border-1 w-full rounded-b-lg border-gray-200">
              <EmptyContent
                icon="binoculars"
                title={{ id: 'balancePage.table.emptyTitle' }}
                description={{ id: 'balancePage.table.emptyDescription' }}
                withoutButtonIcon
              />
            </div>
          )
        }
        getMenuProps={getMenuProps}
        renderCellWrapper={(className, content) => (
          <div className={clsx(className, 'min-h-[3.625rem] !py-[0.1rem]')}>
            {content}
          </div>
        )}
        // # TODO Enable correct filtering
        tableHeaderChildren={
          <>
            {/** (!!tokensDataLength || !!searchValue) && <Filter />} */}
            <Button
              mode="primarySolid"
              className="ml-2"
              onClick={toggleAddFundsModalOn}
              size="small"
            >
              {formatText({ id: 'balancePage.table.addFunds' })}
            </Button>
          </>
        }
      />
      <BalanceModal
        isOpen={isAddFundsModalOpened}
        onClose={toggleAddFundsModalOff}
      >
        <>
          <h5 className="heading-5 mb-1.5">
            {formatText({ id: 'balancePage.modal.title' })}
          </h5>
          <p className="text-md text-gray-600 mb-6">
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
