import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import { TransactionsProps } from './types';
import { isTxGroup } from '~frame/GasStation/transactionGroup';
import { TransactionType } from '~redux/immutable';
import TransactionDetails from './partials/TransactionDetails';
import EmptyContent from '../EmptyContent';

export const displayName = 'common.Extensions.UserHub.partials.TransactionsTab';

const TransactionsTab: FC<TransactionsProps> = ({
  transactionAndMessageGroups,
  // openIndex,
  // autoOpenTransaction = true,
  // onOpenIndexChange,
  setAutoOpenTransaction = () => {},
  appearance: { interactive },
  appearance,
}) => {
  const { formatMessage } = useIntl();
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(
    // autoOpenTransaction ? 0 : -1,
    0,
  );

  // const onClick = (index: number) => {
  //   if (!onOpenIndexChange) return;

  //   if (index === openIndex) {
  //     onOpenIndexChange(undefined);

  //     return;
  //   }

  //   onOpenIndexChange(index);
  // };

  const unselectTransactionGroup = () => {
    setSelectedGroupIdx(-1);
    setAutoOpenTransaction(false);
  };

  // const selectTransactionGroup = (idx: number) => {
  //   setSelectedGroupIdx(idx);
  // };

  const isEmpty =
    !transactionAndMessageGroups || !transactionAndMessageGroups.length;

  const renderTransactions = () => {
    let detailsTransactionGroup = transactionAndMessageGroups[selectedGroupIdx];
    /*  If the GasStationContent is less interactive,
     * like in StepConfirmTransactions, we select the first group buy default
     */
    if (!interactive && selectedGroupIdx === -1) {
      [detailsTransactionGroup] = transactionAndMessageGroups;
    }

    if (detailsTransactionGroup || !interactive) {
      const isTx = isTxGroup(detailsTransactionGroup);
      if (isTx) {
        return (
          <TransactionDetails
            transactionGroup={detailsTransactionGroup as TransactionType[]}
            unselectTransactionGroup={unselectTransactionGroup}
            appearance={appearance}
          />
        );
      }

      // @TODO: when handle this cases?
      // }
      // return (
      //   <MessageCardDetails
      //     message={detailsTransactionGroup[0] as MessageType}
      //     onClose={unselectTransactionGroup}
      //   />
      // );
      return;
    }
    // return (
    //   <TransactionList
    //     transactionAndMessageGroups={transactionAndMessageGroups}
    //     onClickGroup={selectTransactionGroup}
    //   />
    // );
  };

  return (
    <>
      <div className="flex items-center justify-between pb-4 relative">
        <div className="font-semibold text-lg text-gray-900">
          {formatMessage({ id: 'transactions' })}
        </div>
      </div>
      <ul>
        {isEmpty ? (
          <EmptyContent contentName="transactions" />
        ) : (
          renderTransactions()
        )}
        {/* {transactionsItems.map((item, index) => (
          <li
            key={item.key}
            className="border-b border-gray-100 py-3.5 last:border-none first:pt-0 last:pb-0"
          >
            <TransactionsItem
              {...item}
              isOpen={openIndex === index}
              onClick={() => onClick(index)}
            />
          </li>
        ))} */}
      </ul>
    </>
  );
};

TransactionsTab.displayName = displayName;

export default TransactionsTab;
