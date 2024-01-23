import { ArrowDown, ArrowUp } from 'phosphor-react';
import React from 'react';

import { useColonyContext } from '~hooks';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import useTableSort, { TableSortDirection } from '~hooks/useTableSort';
import useToggle from '~hooks/useToggle';
import CurrencyConversion from '~shared/CurrencyConversion';
import Numeral from '~shared/Numeral';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import TokenTypeBadge from '~v5/common/Pills/TokenTypeBadge';
import { TOKEN_TYPE } from '~v5/common/Pills/TokenTypeBadge/types';
import Table from '~v5/common/Table';
import CopyWallet from '~v5/shared/CopyWallet';

import BalanceModal from '../BalanceModal';
import TokenAvatar from '../TokenAvatar';

import { TokenMeatballMenu } from './partials/TokenMeatballMenu';
import { BalanceTableSortFields } from './types';
import { useTokenBalances } from './useTokenBalances';

const displayName = 'v5.pages.BalancePage.partials.BalanceTable';

const BalanceTable = () => {
  const {
    colony: { nativeToken, status, colonyAddress },
  } = useColonyContext();
  const { sort, handleSortFieldClick } = useTableSort<BalanceTableSortFields>();

  const [
    isAddFundsModalOpened,
    { toggleOn: toggleAddFundsModalOn, toggleOff: toggleAddFundsModalOff },
  ] = useToggle();

  const { data } = useTokenBalances(sort);
  const { nativeToken: nativeTokenStatus } = status || {};

  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  const getSortArrow = (field: BalanceTableSortFields) => {
    if (sort === null || sort.field !== field) {
      return null;
    }

    if (sort.direction === TableSortDirection.ASC) {
      return <ArrowUp size={12} />;
    }
    return <ArrowDown size={12} />;
  };

  return (
    <>
      <div className="overflow-x-auto max-w-full">
        <Table>
          <tr>
            <th>{formatText({ id: 'table.row.asset' })}</th>
            <th className="hidden sm:table-cell">
              {formatText({ id: 'table.row.symbol' })}
            </th>
            <th className="hidden sm:table-cell">
              {formatText({ id: 'table.row.type' })}
            </th>
            <th>
              <button
                type="button"
                className="flex items-center gap-1"
                onClick={() => {
                  handleSortFieldClick(BalanceTableSortFields.BALANCE);
                }}
              >
                {formatText({ id: 'table.row.balance' })}
                {getSortArrow(BalanceTableSortFields.BALANCE)}
              </button>
            </th>

            <th> </th>
          </tr>
          <tbody>
            {data.map(({ balance, token }) => {
              const isTokenNative =
                token.tokenAddress === nativeToken.tokenAddress;

              return (
                <tr key={token.name}>
                  <td className="w-full">
                    <TokenAvatar
                      token={token}
                      isTokenNative={isTokenNative}
                      nativeTokenStatus={nativeTokenStatus ?? undefined}
                    />
                  </td>
                  <td className="hidden sm:table-cell">{token.symbol}</td>
                  <td className="hidden sm:table-cell">
                    {isTokenNative && (
                      <TokenTypeBadge tokenType={TOKEN_TYPE.native}>
                        {formatText({ id: 'token.type.native' })}
                      </TokenTypeBadge>
                    )}
                  </td>
                  <td className="whitespace-nowrap">
                    <div className="flex flex-col justify-center">
                      <Numeral
                        value={balance}
                        decimals={getTokenDecimalsWithFallback(token.decimals)}
                        className="text-1 text-gray-900"
                        suffix={token.symbol}
                      />
                      <CurrencyConversion
                        tokenBalance={balance}
                        contractAddress={token.tokenAddress}
                        className="text-gray-600 !text-sm"
                      />
                    </div>
                  </td>
                  <td className="w-6">
                    <TokenMeatballMenu
                      token={token}
                      toggleAddFundsModalOn={toggleAddFundsModalOn}
                      isTokenNative={isTokenNative}
                      nativeTokenStatus={nativeTokenStatus}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
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
