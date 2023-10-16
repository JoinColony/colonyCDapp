import React, { FC } from 'react';
import Filter from '~v5/common/Filter';
import Button from '~v5/shared/Button';
import EmptyContent from '~v5/common/EmptyContent';
import { useSearchContext } from '~context/SearchContext';
import TableHead from './TableHead';
import TableItem from './TableItem';
import { formatText } from '~utils/intl';
import Modal from '~v5/shared/Modal';
import { useColonyContext } from '~hooks';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import CopyWallet from '~v5/shared/CopyWallet/CopyWallet';

const displayName = 'v5.pages.VerifiedPage.partials.BalaceTable';

const BalaceTable: FC = () => {
  //   const { searchValue } = useSearchContext();
  const { colony } = useColonyContext();
  const { balances, nativeToken, status } = colony || {};
  const { nativeToken: nativeTokenStatus } = status || {};
  //   const { onChange, selectedMembers } = useVerifiedTable();

  const {
    avatarModalToggle: [
      isAddFundsModalOpened,
      { toggleOn: toggleAddFundsModalOn, toggleOff: toggleAddFundsModalOff },
    ],
  } = useActionSidebarContext();
  const { handleClipboardCopy, isCopied } = useCopyToClipboard('0xCFD3aa1EbC6119D80Ed47955a87A9d9C281A97B3');
console.log(colony);
  return (
    <>
      <div className="py-5 px-4 border border-gray-200 rounded-t-lg">
        <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col">
          <div className="flex items-center">
            <h4 className="heading-5 mr-3">
              {formatText({ id: 'balancePage.table.title' })}
            </h4>
          </div>
          <div className="flex items-center mt-2.5 sm:mt-0">
            {/* {(!!listLength || !!searchValue) && <Filter />} */}
            <Button
              mode="primarySolid"
              className="ml-2"
              onClick={toggleAddFundsModalOn}
              size="small"
            >
              {formatText({ id: 'balancePage.table.addFunds' })}
            </Button>
          </div>
        </div>
      </div>
      <TableHead onClick={() => {}} />
      {colony?.tokens && (
        <div className="px-4 border border-gray-200 rounded-b-lg">
          {colony.tokens.items.map((item) => (
            <TableItem
              key={item?.token.tokenAddress}
              token={item?.token}
              isTokenNative={
                item?.token.tokenAddress === nativeToken?.tokenAddress
              }
              balances={balances || {}}
              nativeTokenStatus={nativeTokenStatus || {}}
              onChange={() => {}}
            />
          ))}
        </div>
      )}
      <Modal
        isOpen={isAddFundsModalOpened}
        onClose={toggleAddFundsModalOff}
        onConfirm={toggleAddFundsModalOff}
        buttonMode="primarySolid"
        icon="piggy-bank"
        confirmMessage={formatText({
          id: 'button.sendFunds',
        })}
        closeMessage={formatText({ id: 'button.cancel' })}
      >
        <h5 className="heading-5 mb-1.5">
          {formatText({ id: 'balancePage.modal.title' })}
        </h5>
        <p className="text-md text-gray-600 mb-6">
          {formatText({ id: 'balancePage.modal.subtitle' })}
        </p>
        <div className="flex sm:flex-row flex-col gap-4 sm:gap-2" />
        <span className="flex text-1">
          {formatText({ id: 'balancePage.send.funds' })}
        </span>
        <CopyWallet
          isCopied={isCopied}
          handleClipboardCopy={handleClipboardCopy}
          walletAddress="0xCFD3aa1EbC6119D80Ed47955a87A9d9C281A97B3"
        />
      </Modal>
    </>
  );
};

BalaceTable.displayName = displayName;

export default BalaceTable;
