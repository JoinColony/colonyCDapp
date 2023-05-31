import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { AnimatePresence, motion } from 'framer-motion';

import Icon from '~shared/Extensions/Icon';
import NotificationBanner from '~common/Extensions/NotificationBanner/NotificationBanner';
import styles from './TransactionsItem.module.css';
import { TransactionsItemProps } from '../../types';
import { accordionAnimation } from '~constants/accordionAnimation';
import TransactionsHeader from '../TransactionsHeader';
import { TRANSACTION_STATUSES } from '~types';

export const displayName = 'common.Extensions.UserHub.TransactionsTab.partials.TransactionsItem';

const TransactionsItem: FC<TransactionsItemProps> = ({
  title,
  description,
  date,
  status,
  content,
  isOpen,
  onClick,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      {content ? (
        <button
          type="button"
          aria-label={`${formatMessage({ id: 'ariaLabel.open' })} ${formatMessage({
            id: `transactionTab.${title}`,
            defaultMessage: `${title}`,
          })}`}
          onClick={onClick}
          className="flex gap-4 justify-between w-full text-left"
        >
          <TransactionsHeader title={title} description={description} date={date} status={status} />
        </button>
      ) : (
        <div className="flex gap-4 justify-between w-full text-left">
          <TransactionsHeader title={title} description={description} date={date} status={status} />
        </div>
      )}
      {content && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="accordion-content"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={accordionAnimation}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="overflow-hidden text-gray-600 text-md mt-2"
            >
              {content.map((item, index) => (
                <div
                  key={item.key}
                  className={clsx(styles.listItem, {
                    'font-semibold text-gray-900': item.isCurrentAction,
                    'before:bg-success-400':
                      item.isCurrentAction &&
                      (item.status === TRANSACTION_STATUSES.READY || item.status === TRANSACTION_STATUSES.SUCCEEDED),
                    'before:bg-negative-400': item.isCurrentAction && item.status === TRANSACTION_STATUSES.FAILED,
                    'before:!bg-blue-400': item.isCurrentAction && item.isPending,
                  })}
                >
                  <div className="flex justify-between items-center">
                    <h4>
                      {index + 1}. {item.title}
                    </h4>
                    {item.status && !item.isPending && (
                      <div
                        className={clsx('flex ml-2', {
                          'text-success-400':
                            item.status === TRANSACTION_STATUSES.READY ||
                            item.status === TRANSACTION_STATUSES.SUCCEEDED,
                          'text-negative-400': TRANSACTION_STATUSES.FAILED,
                        })}
                      >
                        <Icon
                          name={
                            item.status === TRANSACTION_STATUSES.READY || item.status === TRANSACTION_STATUSES.SUCCEEDED
                              ? 'check-circle'
                              : 'warning-circle'
                          }
                          appearance={{ size: 'tiny' }}
                        />
                      </div>
                    )}
                    {item.isPending && (
                      <Icon
                        name="spinner-gap"
                        className="ml-[0.59375rem] w-[0.8125rem] h-[0.8125rem] animate-spin text-blue-400"
                        appearance={{ size: 'tiny' }}
                      />
                    )}
                  </div>
                  {item.notificationInfo && (
                    <div className="mt-2">
                      <NotificationBanner
                        status="error"
                        title={item.notificationInfo}
                        actionText={formatMessage({ id: 'retry' })}
                        actionType="redirect"
                        isAlt
                      />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

TransactionsItem.displayName = displayName;

export default TransactionsItem;
