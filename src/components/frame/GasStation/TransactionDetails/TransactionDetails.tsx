import React, { MouseEvent } from 'react';

import { TransactionStatus } from '~gql';
import { TransactionType } from '~redux/immutable';
import CardList from '~shared/CardList';

import { Appearance } from '../GasStationContent';
import GasStationControls from '../GasStationControls';
import MetaMaskWalletInteraction from '../MetaMaskWalletInteraction';
import { GroupedTransaction } from '../TransactionCard';
import { getActiveTransactionIdx } from '../transactionGroup';

import TransactionBackToList from './TransactionBackToList';

const showPrice = (tx?: TransactionType) =>
  !!tx &&
  (tx.status === TransactionStatus.Ready ||
    tx.status === TransactionStatus.Failed);

const showInteraction = (tx?: TransactionType) =>
  !!tx && tx.status !== TransactionStatus.Succeeded;

interface Props {
  /* If we are only showing the transaction details
   * and no overview we do not need a back button
   */
  appearance: Appearance;
  transactionGroup: TransactionType[];
  onClose: (event: MouseEvent<HTMLButtonElement>) => void;
}

const displayName = 'frame.GasStation.TransactionDetails';

const TransactionDetails = ({
  onClose,
  transactionGroup,
  appearance,
}: Props) => {
  const { interactive } = appearance;
  const selectedTransactionIdx = getActiveTransactionIdx(transactionGroup) || 0;
  const selectedTransaction = transactionGroup[selectedTransactionIdx];
  return (
    <div>
      {interactive && <TransactionBackToList onClose={onClose} />}
      <CardList appearance={{ numCols: '1' }}>
        <GroupedTransaction
          appearance={appearance}
          transactionGroup={transactionGroup}
          selectedTransactionIdx={selectedTransactionIdx}
        />
      </CardList>
      {showPrice(selectedTransaction) && (
        <GasStationControls
          transaction={selectedTransaction as TransactionType}
        />
      )}
      {showInteraction(selectedTransaction) && (
        <MetaMaskWalletInteraction
          transactionType={
            selectedTransaction.metatransaction
              ? 'metatransaction'
              : 'transaction'
          }
        />
      )}
    </div>
  );
};

TransactionDetails.displayName = displayName;

export default TransactionDetails;
