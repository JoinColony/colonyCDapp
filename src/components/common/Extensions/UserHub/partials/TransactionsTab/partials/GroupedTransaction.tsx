import { CaretDown, CaretUp } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { TransactionStatus } from '~gql';
import { useMobile } from '~hooks';
import { type TransactionType } from '~redux/immutable/index.ts';
import { TX_SEARCH_PARAM } from '~routes';
import {
  getGroupKey,
  getGroupStatus,
  getGroupValues,
  getActiveTransactionIdx,
  getGroupId,
  getHasZeroAddressTransaction,
} from '~state/transactionState.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { arrayToObject } from '~utils/arrays/index.ts';
import { getFormattedDateFrom } from '~utils/getFormattedDateFrom.ts';
import { formatText } from '~utils/intl.ts';

import { type GroupedTransactionProps } from '../types.ts';

import GroupedTransactionContent from './GroupedTransactionContent.tsx';
import GroupedTransactionStatus from './GroupedTransactionStatus.tsx';

const displayName =
  'common.Extensions.UserHub.partials.TransactionsTab.partials.GroupedTransaction';

// When the user clicks on a transaction, we want to use the hash to navigate to the associated action
// in the action sidebar. For some grouped transactions, we don't have a hash which is associated with
// an action. Any grouped transaction with a key in the below list cannot be linked to an action.
const GROUP_KEYS_WHICH_CANNOT_LINK = [
  TRANSACTION_METHODS.StakeMotion,
  TRANSACTION_METHODS.FinalizeMotion,
  TRANSACTION_METHODS.EscalateMotion,
  TRANSACTION_METHODS.EnableExtension,
  TRANSACTION_METHODS.ClaimColonyFunds,
];

const GroupedTransaction: FC<GroupedTransactionProps> = ({
  transactionGroup,
  isContentOpened,
  onToggleExpand,
  hideSummary = false,
  isClickable = true,
  isCancelable = true,
}) => {
  const isMobile = useMobile();
  const navigate = useNavigate();

  const groupKey = getGroupKey(transactionGroup);
  const groupId = getGroupId(transactionGroup);
  const status = getGroupStatus(transactionGroup);
  const values = getGroupValues<TransactionType>(transactionGroup);
  const hasZeroAddressTransaction =
    getHasZeroAddressTransaction(transactionGroup);

  const groupMsgId = `transaction.group`;

  const groupMsgTitle = values.group?.title || {
    id: `${groupMsgId}.${groupKey}.title`,
  };
  const groupMsgDescription = values.group?.description || {
    id:
      import.meta.env.VITE_DEBUG === 'true'
        ? `transaction.debug.description`
        : `${groupMsgId}.${groupKey}.description`,
  };

  const { methodName, context, params = [] } = values;
  const msgValues = { methodName, context };

  const groupTitle = formatText(
    groupMsgTitle,
    values.group?.titleValues || {
      ...arrayToObject(params),
      ...msgValues,
    },
  );

  const groupDescription = formatText(
    groupMsgDescription,
    values.group?.descriptionValues || {
      ...arrayToObject(params),
      ...msgValues,
    },
  );

  const selectedTransactionIdx = getActiveTransactionIdx(transactionGroup) || 0;

  const canLinkToAction =
    isClickable &&
    values.group?.key &&
    !GROUP_KEYS_WHICH_CANNOT_LINK.includes(
      values.group.key as TRANSACTION_METHODS,
    ) &&
    status === TransactionStatus.Succeeded &&
    !hasZeroAddressTransaction;

  const createdAt =
    transactionGroup?.[0].createdAt &&
    getFormattedDateFrom(new Date(transactionGroup[0].createdAt));

  const handleNavigateToAction = () => {
    if (canLinkToAction) {
      navigate(
        `${window.location.pathname}?${TX_SEARCH_PARAM}=${values.hash}`,
        {
          replace: true,
        },
      );
    }
  };

  return (
    <li
      className={clsx(`border-b border-gray-100 py-3.5 last:border-none`, {
        'list-none': hideSummary,
        'hover:bg-gray-25': !!canLinkToAction,
      })}
    >
      <div className="flex w-full flex-col items-start">
        {!hideSummary && (
          <div className="relative w-full">
            <button
              type="button"
              onClick={handleNavigateToAction}
              disabled={!canLinkToAction || hideSummary}
              className={clsx(
                'flex w-full flex-col items-start gap-1 sm:px-6',
                {
                  'cursor-default': !canLinkToAction,
                },
              )}
            >
              {isMobile && <GroupedTransactionStatus status={status} />}
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <h4
                      className="truncate text-left text-1 sm:w-[190px]"
                      title={groupTitle}
                    >
                      {groupTitle}
                    </h4>
                    {createdAt && (
                      <span className="mt-0.5 block whitespace-nowrap text-xs text-gray-400">
                        {createdAt}
                      </span>
                    )}
                  </div>
                  <p
                    className="truncate text-left text-xs text-gray-600 sm:w-[250px]"
                    title={groupDescription}
                  >
                    {groupDescription}
                  </p>
                </div>
                <div className="flex min-w-0 gap-2 pr-8">
                  {!isMobile && <GroupedTransactionStatus status={status} />}
                </div>
              </div>
            </button>
            <button
              type="button"
              aria-label={formatText({
                id: 'handle.unselect.transaction',
              })}
              className="absolute right-0 flex w-6 -translate-y-1/2 items-center justify-center sm:right-6"
              style={{
                top: '50%',
              }}
              onClick={(e) => {
                e.stopPropagation();
                return onToggleExpand && onToggleExpand(groupId);
              }}
            >
              <span className="pointer">
                {isContentOpened ? (
                  <CaretUp size={16} />
                ) : (
                  <CaretDown size={16} />
                )}
              </span>
            </button>
          </div>
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
              <ul className="pt-2 sm:px-6">
                {transactionGroup.map((transaction, idx) => (
                  <GroupedTransactionContent
                    key={transaction.id}
                    idx={idx}
                    transaction={transaction}
                    selected={idx === selectedTransactionIdx}
                    isCancelable={isCancelable}
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
