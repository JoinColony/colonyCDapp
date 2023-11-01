import React, { FC } from 'react';
import clsx from 'clsx';
import { FormattedMessage, useIntl } from 'react-intl';
import { AnimatePresence, motion } from 'framer-motion';

import Icon from '~shared/Icon';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import styles from './TransactionsItem.module.css';
import { TransactionsItemProps } from '../../types';
import { accordionAnimation } from '~constants/accordionAnimation';
import TransactionsHeader from '../TransactionsHeader';
import { TransactionStatus } from '~gql';

export const displayName =
  'common.Extensions.UserHub.TransactionsTab.partials.TransactionsItem';

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
          aria-label={`${formatMessage({
            id: 'ariaLabel.open',
          })} ${formatMessage({
            id: `transactionTab.${title}`,
            defaultMessage: `${title}`,
          })}`}
          onClick={onClick}
          className="flex gap-4 justify-between w-full text-left"
        >
          <TransactionsHeader
            title={title}
            description={description}
            date={date}
            status={status}
          />
        </button>
      ) : (
        <div className="flex gap-4 justify-between w-full text-left">
          <TransactionsHeader
            title={title}
            description={description}
            date={date}
            status={status}
          />
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
              {content.map(
                (
                  {
                    key,
                    isCurrentAction,
                    status: statusContent,
                    isPending,
                    notificationInfo,
                  },
                  index,
                ) => (
                  <div
                    key={key}
                    className={clsx(styles.listItem, {
                      'font-semibold': isCurrentAction,
                      'before:bg-success-400':
                        isCurrentAction &&
                        (statusContent === TransactionStatus.Ready ||
                          statusContent === TransactionStatus.Succeeded),
                      'before:bg-negative-400':
                        isCurrentAction &&
                        statusContent === TransactionStatus.Failed,
                      'before:!bg-blue-400': isCurrentAction && isPending,
                    })}
                  >
                    <div className="flex justify-between items-center">
                      <h4>
                        {index + 1}. {title}
                      </h4>
                      {statusContent && !isPending && (
                        <div
                          className={clsx('flex ml-2', {
                            'text-success-400':
                              statusContent === TransactionStatus.Ready ||
                              statusContent === TransactionStatus.Succeeded,
                            'text-negative-400': TransactionStatus.Failed,
                          })}
                        >
                          <Icon
                            name={
                              statusContent === TransactionStatus.Ready ||
                              statusContent === TransactionStatus.Succeeded
                                ? 'check-circle'
                                : 'warning-circle'
                            }
                            appearance={{ size: 'tiny' }}
                          />
                        </div>
                      )}
                      {isPending && (
                        <Icon
                          name="spinner-gap"
                          className="ml-2.5 w-[0.8125rem] h-[0.8125rem] animate-spin text-blue-400"
                          appearance={{ size: 'tiny' }}
                        />
                      )}
                    </div>
                    {notificationInfo && (
                      <div className="mt-2">
                        <NotificationBanner
                          status="error"
                          title={notificationInfo}
                          action={{
                            type: 'redirect',
                            actionText: <FormattedMessage id="retry" />,
                            href: '',
                          }}
                          isAlt
                        />
                      </div>
                    )}
                  </div>
                ),
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

TransactionsItem.displayName = displayName;

export default TransactionsItem;
