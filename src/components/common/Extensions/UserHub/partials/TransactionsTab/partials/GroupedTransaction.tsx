import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { type TransactionType } from '~redux/immutable/index.ts';
import { arrayToObject } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';

import {
  getActiveTransactionIdx,
  getGroupKey,
  getGroupStatus,
  getGroupValues,
} from '../transactionGroup.ts';
import { type GroupedTransactionProps } from '../types.ts';

import GroupedTransactionContent from './GroupedTransactionContent.tsx';
import TransactionStatus from './TransactionStatus.tsx';

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
    id:
      import.meta.env.VITE_DEBUG === 'true'
        ? `${
            transactionGroup[0].metatransaction ? 'meta' : ''
          }transaction.debug.description`
        : `${
            transactionGroup[0].metatransaction ? 'meta' : ''
          }transaction.${groupKey}.description`,
  };

  const selectedTransactionIdx = getActiveTransactionIdx(transactionGroup) || 0;

  const { methodName, context } = values;
  const titleValues = { methodName, context };

  const value = formatText(
    {
      ...defaultTransactionGroupMessageDescriptorTitleId,
      ...values.group?.title,
    },
    values.group?.titleValues || {
      ...arrayToObject(values.params),
      ...titleValues,
    },
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
              <p className="text-xs text-gray-600">
                <FormattedMessage
                  {...defaultTransactionGroupMessageDescriptorDescriptionId}
                  {...values.group?.description}
                  values={
                    values.group?.descriptionValues || {
                      ...arrayToObject(values.params),
                      ...titleValues,
                    }
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
            className="-mt-1.5 overflow-hidden text-md text-gray-600"
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
