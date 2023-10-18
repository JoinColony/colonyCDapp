import React, { FC } from 'react';
import Button from '~v5/shared/Button';
import TableHead from './TableHead';
import TableItem from './TableItem';
import { formatText } from '~utils/intl';
import { useColonyContext } from '~hooks';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import CopyWallet from '~v5/shared/CopyWallet/CopyWallet';
import TransferFundsForm from './TransferFunds';
import { BalaceTableProps } from '../types';
import Modal from '~v5/shared/Modal';

const displayName = 'v5.pages.BalancePage.partials.BalaceTable';

const BalaceTable: FC<BalaceTableProps> = ({
  data,
  isSorted,
  onBalanceSort,
}) => {
  const { colony } = useColonyContext();
  const { balances, nativeToken, status } = colony || {};
  const { nativeToken: nativeTokenStatus } = status || {};

  const {
    avatarModalToggle: [
      isAddFundsModalOpened,
      { toggleOn: toggleAddFundsModalOn, toggleOff: toggleAddFundsModalOff },
    ],
  } = useActionSidebarContext();
  const { handleClipboardCopy, isCopied } = useCopyToClipboard(
    '0xCFD3aa1EbC6119D80Ed47955a87A9d9C281A97B3', // @TODO: fix me!
  );

  if (!colony || !colony.tokens) {
    return null;
  }

  return (
    <>
      <div className="pb-4">
        <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col">
          <div className="flex items-center">
            <h4 className="heading-5 mr-3">
              {formatText({ id: 'balancePage.table.title' })}
            </h4>
          </div>
          <div className="flex items-center mt-2.5 sm:mt-0">
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
      <TableHead onClick={onBalanceSort} isSorted={isSorted} />
      {data && (
        <div className="px-4 border border-gray-200 rounded-b-lg">
          {data.map((item) => (
            <TableItem
              key={item.token.tokenAddress}
              token={item.token}
              isTokenNative={
                item.token.tokenAddress === nativeToken?.tokenAddress
              }
              balances={balances || {}}
              nativeTokenStatus={nativeTokenStatus || {}}
            />
          ))}
        </div>
      )}
      <Modal
        isOpen={isAddFundsModalOpened}
        onClose={toggleAddFundsModalOff}
        buttonMode="primarySolid"
        icon="piggy-bank"
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
        <p className="text-1 mb-2">
          {formatText({ id: 'balancePage.modal.add.funds.form.wallet' })}
        </p>
        <TransferFundsForm onClose={toggleAddFundsModalOff} />
      </Modal>
    </>
  );
};

BalaceTable.displayName = displayName;

export default BalaceTable;
