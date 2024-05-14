import { CaretDown, CaretUp } from '@phosphor-icons/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState, type FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useMobile } from '~hooks';
import { type TransactionType } from '~redux/immutable/index.ts';
import { TX_SEARCH_PARAM } from '~routes';
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

const GROUP_KEYS_WHICH_CANNOT_LINK = [
  'stakeMotion',
  'finalizeMotion',
  'escalateMotion',
  'enableExtension',
];

const GroupedTransaction: FC<GroupedTransactionProps> = ({
  transactionGroup,
  groupId,
  isContentOpened,
  onToggleExpand,
  hideSummary = false,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const navigate = useNavigate();

  const containerRef = useRef<HTMLLIElement>(null);

  const groupKey = getGroupKey(transactionGroup);
  const status = getGroupStatus(transactionGroup);
  const values = getGroupValues<TransactionType>(transactionGroup);

  const [closedContainerHeight, setClosedContainerHeight] = useState<
    number | null
  >(null);

  const canLinkToAction =
    values.group?.key &&
    !GROUP_KEYS_WHICH_CANNOT_LINK.includes(values.group.key);

  useEffect(() => {
    if (containerRef.current) {
      setClosedContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

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
      className={clsx(`relative border-b border-gray-200 last:border-none`, {
        'list-none': hideSummary,
      })}
      ref={containerRef}
    >
      <button
        type="button"
        onClick={handleNavigateToAction}
        disabled={!canLinkToAction || hideSummary}
        className={clsx(
          'flex w-full flex-col items-start gap-1 py-3.5  sm:px-6',
          {
            'hover:bg-gray-25': !!canLinkToAction,
            'cursor-default': !canLinkToAction,
          },
        )}
      >
        {!hideSummary && (
          <div className="flex w-full flex-col items-start gap-1">
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
                <p className="text-left text-xs text-gray-600 break-word">
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
              <div className="flex gap-2 pr-8">
                {!isMobile && <GroupedTransactionStatus status={status} />}
              </div>
            </div>
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
      </button>
      {!hideSummary && (
        <button
          type="button"
          aria-label={formatMessage({
            id: 'handle.unselect.transaction',
          })}
          className="absolute right-0 flex w-6 -translate-y-1/2 items-center justify-center sm:right-6"
          style={{ top: closedContainerHeight ? closedContainerHeight / 2 : 0 }}
          onClick={(e) => {
            e.stopPropagation();
            return onToggleExpand && onToggleExpand(groupId);
          }}
        >
          <span className="pointer">
            {isContentOpened ? <CaretUp size={16} /> : <CaretDown size={16} />}
          </span>
        </button>
      )}
    </li>
  );
};

GroupedTransaction.displayName = displayName;

export default GroupedTransaction;
