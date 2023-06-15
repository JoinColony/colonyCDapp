import React, { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { TransactionType } from '~redux/immutable';
import { arrayToObject } from '~utils/arrays';
import { formatText } from '~utils/intl';
import styles from '~frame/GasStation/TransactionCard/GroupedTransaction.css';
import {
  getGroupKey,
  getGroupStatus,
  getGroupValues,
} from '~frame/GasStation/transactionGroup';
import TransactionStatus from './TransactionStatus';
import GroupedTransactionContent from './GroupedTransactionContent';
import { GroupedTransactionProps } from '../types';

const displayName =
  'common.Extensions.UserHub.partials.TransactionsTab.partials.GroupedTransaction';

const GroupedTransaction: FC<GroupedTransactionProps> = ({
  // appearance,
  selectedTransactionIdx,
  transactionGroup,
  selectedTransaction,
  unselectTransactionGroup,
}) => {
  const { formatMessage } = useIntl();
  // const { interactive } = appearance;
  // const [isOpen, setIsOpen] = useState<boolean>(true);

  const groupKey = getGroupKey(transactionGroup);
  const status = getGroupStatus(transactionGroup);
  const values = getGroupValues<TransactionType>(transactionGroup);

  const defaultTransactionGroupMessageDescriptorTitleId = {
    id: `${
      transactionGroup[0].metatransaction ? 'meta' : ''
    }transaction.${groupKey}.title`,
  };
  const defaultTransactionGroupMessageDescriptorDescriptionId = {
    id: process.env.DEBUG
      ? `${
          transactionGroup[0].metatransaction ? 'meta' : ''
        }transaction.debug.description`
      : `${
          transactionGroup[0].metatransaction ? 'meta' : ''
        }transaction.${groupKey}.description`,
  };

  const value =
    formatText(
      {
        ...defaultTransactionGroupMessageDescriptorTitleId,
        ...values.group?.title,
      },
      values.group?.titleValues || arrayToObject(values.params),
    ) || '';

  // const handleClose = useCallback(() => {
  //   //   if (!isDismissible) return;
  //   setIsOpen(false);
  //   //   if (typeof callback === 'function') {
  //   //     callback();
  //   //   }
  // }, []);

  // if (!isOpen) return null;

  return (
    <li>
      <button
        type="button"
        aria-label={formatMessage({ id: 'handle.unselect.transaction' })}
        className="w-full"
        onClick={(event) => unselectTransactionGroup(event)}
      >
        <div className="flex items-center justify-between py-3.5">
          <div className="flex flex-col items-start">
            <h4 className="font-medium text-md">{value}</h4>
            <p className="text-gray-600 text-xs">
              <FormattedMessage
                {...defaultTransactionGroupMessageDescriptorDescriptionId}
                {...values.group?.description}
                values={
                  values.group?.descriptionValues ||
                  arrayToObject(values.params)
                }
              />
            </p>
          </div>
          <TransactionStatus
            groupCount={transactionGroup.length}
            status={status}
            date={transactionGroup?.[0].createdAt}
          />
        </div>
      </button>
      <ul className={styles.transactionList}>
        {transactionGroup.map((transaction, idx) => (
          <GroupedTransactionContent
            key={transaction.id}
            idx={idx}
            selected={idx === selectedTransactionIdx}
            transaction={transaction}
            selectedTransaction={selectedTransaction}
            // appearance={appearance}
          />
        ))}
      </ul>
    </li>
  );
};

GroupedTransaction.displayName = displayName;

export default GroupedTransaction;
