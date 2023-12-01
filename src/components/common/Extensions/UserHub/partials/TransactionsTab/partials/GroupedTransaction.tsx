import React, { FC } from 'react';
import clsx from 'clsx';
import { FormattedMessage, useIntl } from 'react-intl';
import { AnimatePresence, motion } from 'framer-motion';

import { TransactionType } from '~redux/immutable';
import { arrayToObject } from '~utils/arrays';
import { formatText } from '~utils/intl';
import {
  getActiveTransactionIdx,
  getGroupKey,
  getGroupStatus,
  getGroupValues,
} from '~frame/GasStation/transactionGroup';
import TransactionStatus from './TransactionStatus';
import GroupedTransactionContent from './GroupedTransactionContent';
import { GroupedTransactionProps } from '../types';
import { accordionAnimation } from '~constants/accordionAnimation';

const displayName =
  'common.Extensions.UserHub.partials.TransactionsTab.partials.GroupedTransaction';

const GroupedTransaction: FC<GroupedTransactionProps> = ({
  transactionGroup,
  groupId,
  isContentOpened,
  onClick,
  hideButton = false,
}) => {
  const { formatMessage } = useIntl();

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

  const selectedTransactionIdx = getActiveTransactionIdx(transactionGroup) || 0;

  const value = formatText(
    {
      ...defaultTransactionGroupMessageDescriptorTitleId,
      ...values.group?.title,
    },
    values.group?.titleValues || arrayToObject(values.params),
  );

  return (
    <li
      className={clsx(`border-b border-gray-200 last:border-none`, {
        'list-none': hideButton,
      })}
    >
      {!hideButton && (
        <button
          type="button"
          aria-label={formatMessage({ id: 'handle.unselect.transaction' })}
          className="w-full"
          onClick={() => onClick && onClick(groupId)}
        >
          <div className="flex items-center justify-between py-3.5">
            <div className="flex flex-col items-start">
              <h4 className="text-1">{value}</h4>
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
      )}

      <AnimatePresence>
        {isContentOpened && (
          <motion.div
            key="accordion-content"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={accordionAnimation}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden text-gray-600 text-md -mt-1.5"
          >
            <ul>
              {transactionGroup.map((transaction, idx) => (
                <GroupedTransactionContent
                  key={transaction.id}
                  idx={idx}
                  transaction={transaction}
                  selected={idx === selectedTransactionIdx}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

GroupedTransaction.displayName = displayName;

export default GroupedTransaction;
