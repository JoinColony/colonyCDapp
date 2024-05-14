import { CaretDown, CaretUp } from '@phosphor-icons/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useMobile } from '~hooks';
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
import GroupedTransactionStatus from './GroupedTransactionStatus.tsx';

const displayName =
  'common.Extensions.UserHub.partials.TransactionsTab.partials.GroupedTransaction';

const GroupedTransaction: FC<GroupedTransactionProps> = ({
  transactionGroup,
  groupId,
  isContentOpened,
  onToggleExpand,
  hideButton = false,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

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

  const createdAt =
    transactionGroup?.[0].createdAt &&
    format(new Date(transactionGroup[0].createdAt), 'dd MMMM yyyy');

  return (
    <li
      className={clsx(`border-b border-gray-200  last:border-none`, {
        'list-none': hideButton,
      })}
    >
      <div className="flex flex-col items-start gap-1 py-3.5 hover:bg-gray-25 sm:px-6">
        {!hideButton && (
          <>
            {isMobile && <GroupedTransactionStatus status={status} />}
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-1">{value}</h4>
                  {createdAt && (
                    <span className="mt-0.5 block text-xs text-gray-400">
                      {createdAt}
                    </span>
                  )}
                </div>
                <p className="text-left text-xs text-gray-600">
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
              <div className="flex gap-2">
                {!isMobile && <GroupedTransactionStatus status={status} />}
                <button
                  type="button"
                  aria-label={formatMessage({
                    id: 'handle.unselect.transaction',
                  })}
                  className="flex w-6 items-center justify-center"
                  onClick={() => onToggleExpand && onToggleExpand(groupId)}
                >
                  <span className="pointer">
                    {isContentOpened ? (
                      <CaretUp size={12} />
                    ) : (
                      <CaretDown size={12} />
                    )}
                  </span>
                </button>
              </div>
            </div>
          </>
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
              className="w-full overflow-hidden text-md text-gray-600"
            >
              <ul className="pt-1.5">
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
      </div>
    </li>
  );
};

GroupedTransaction.displayName = displayName;

export default GroupedTransaction;
