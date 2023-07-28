import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { Scrollbar } from 'react-scrollbars-custom';

import { TransactionsProps } from './types';
import { isTxGroup } from '~frame/GasStation/transactionGroup';
import { MessageType, TransactionType } from '~redux/immutable';
import TransactionDetails from './partials/TransactionDetails';
import EmptyContent from '~v5/common/EmptyContent';
import MessageCardDetails from '~frame/GasStation/MessageCardDetails';
import TransactionList from './partials/TransactionList';
import { useMobile } from '~hooks';

export const displayName = 'common.Extensions.UserHub.partials.TransactionsTab';

const TransactionsTab: FC<TransactionsProps> = ({
  transactionAndMessageGroups,
  autoOpenTransaction,
  setAutoOpenTransaction = () => {},
  appearance: { interactive },
}) => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(
    autoOpenTransaction ? 0 : -1,
  );

  const unselectTransactionGroup = () => {
    setSelectedGroupIdx(-1);
    setAutoOpenTransaction(false);
  };

  const renderTransactions = () => {
    let detailsTransactionGroup = transactionAndMessageGroups[selectedGroupIdx];
    if (!interactive && selectedGroupIdx === -1) {
      [detailsTransactionGroup] = transactionAndMessageGroups;
    }

    if (detailsTransactionGroup || !interactive) {
      const isTx = isTxGroup(detailsTransactionGroup);
      if (isTx) {
        return (
          <TransactionDetails
            transactionGroup={detailsTransactionGroup as TransactionType[]}
          />
        );
      }
      // @TODO: when handle this cases?
      return (
        <MessageCardDetails
          message={detailsTransactionGroup[0] as MessageType}
          onClose={unselectTransactionGroup}
        />
      );
    }

    return (
      <TransactionList
        transactionAndMessageGroups={transactionAndMessageGroups}
      />
    );
  };

  const isEmpty =
    !transactionAndMessageGroups || !transactionAndMessageGroups.length;

  return (
    <div className="flex flex-col w-full h-full">
      <p className="heading-5 mb-2.5 sm:mb-0.5">
        {formatMessage({ id: 'transactions' })}
      </p>
      <Scrollbar
        style={{ width: '100%', height: isMobile ? '60vh' : 356 }}
        trackYProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return (
              <span
                {...restProps}
                ref={elementRef}
                className="!bg-transparent !w-[0.3125rem]"
              />
            );
          },
        }}
        thumbYProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return (
              <div {...restProps} ref={elementRef} className="!bg-gray-100" />
            );
          },
        }}
      >
        {isEmpty ? (
          <EmptyContent
            title={{ id: 'empty.content.title.transactions' }}
            description={{ id: 'empty.content.subtitle.transactions' }}
            icon="binoculars"
          />
        ) : (
          renderTransactions()
        )}
      </Scrollbar>
    </div>
  );
};

TransactionsTab.displayName = displayName;

export default TransactionsTab;
