import React, { FC, useState } from 'react';
import clsx from 'clsx';
import {
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { uniqueId } from 'lodash';
import { useColonyContext, useMobile } from '~hooks';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import useToggle from '~hooks/useToggle';
import { useGetSelectedTeamFilter } from '~hooks/useTeamsBreadcrumbs';
import { formatText } from '~utils/intl';
import EmptyContent from '~v5/common/EmptyContent';
import TableWithHeaderAndMeatballMenu from '~v5/common/TableWithHeaderAndMeatballMenu';
import CopyWallet from '~v5/shared/CopyWallet';
import Button from '~v5/shared/Button';
import Filters from '~v5/shared/Filters';
import BalanceModal from '../BalanceModal';
import {
  useBalanceTable,
  useBalanceTableColumns,
  useGetTableMenuProps,
} from './hooks';
import { BalanceTableFieldModel } from './types';

const displayName = 'v5.pages.BalancePage.partials.BalaceTable';

const BalanceTable: FC = () => {
  const selectedTeam = useGetSelectedTeamFilter();
  const { colony } = useColonyContext();
  const { balances, nativeToken, status, colonyAddress } = colony || {};
  const { nativeToken: nativeTokenStatus } = status || {};
  const isMobile = useMobile();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [
    isAddFundsModalOpened,
    { toggleOn: toggleAddFundsModalOn, toggleOff: toggleAddFundsModalOff },
  ] = useToggle();
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  const columns = useBalanceTableColumns(
    nativeToken,
    balances,
    nativeTokenStatus,
    Number(selectedTeam?.nativeId) || undefined,
  );

  const { filteredTokens, searchedTokens } = useBalanceTable();
  const { getMenuProps } = useGetTableMenuProps(
    toggleAddFundsModalOn,
    searchedTokens,
    nativeTokenStatus,
    nativeToken,
  );
  const tokensDataLength = searchedTokens?.length || 0;

  return (
    <>
      <TableWithHeaderAndMeatballMenu<BalanceTableFieldModel>
        title={formatText({ id: 'balancePage.table.title' })}
        verticalOnMobile={false}
        hasPagination={tokensDataLength >= 10}
        getRowId={({ token }) => (token ? token.tokenAddress : uniqueId())}
        columns={columns}
        data={searchedTokens || []}
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
        onSortingChange={setSorting}
        onRowSelectionChange={setRowSelection}
        getSortedRowModel={getSortedRowModel()}
        getFilteredRowModel={getFilteredRowModel()}
        getPaginationRowModel={getPaginationRowModel()}
        emptyContent={
          !tokensDataLength && (
            <EmptyContent
              icon="binoculars"
              title={{ id: 'balancePage.table.emptyTitle' }}
              description={{ id: 'balancePage.table.emptyDescription' }}
              withoutButtonIcon
              className="!py-[2.75rem] !p-0 text-gray-900"
            />
          )
        }
        getMenuProps={getMenuProps}
        renderCellWrapper={(className, content) => (
          <div className={clsx(className, 'min-h-[3.625rem] !py-[0.1rem]')}>
            {content}
          </div>
        )}
      >
        <>
          <Filters {...filteredTokens} />
          <Button
            mode="primarySolid"
            className="ml-2"
            onClick={toggleAddFundsModalOn}
            size="small"
          >
            {formatText({ id: 'balancePage.table.addFunds' })}
          </Button>
        </>
      </TableWithHeaderAndMeatballMenu>
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
