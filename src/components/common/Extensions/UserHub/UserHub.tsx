import React, { FC, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { useMobile } from '~hooks';
import ReputationTab from './partials/ReputationTab';
import StakesTab from './partials/StakesTab';
import TransactionsTab from './partials/TransactionsTab';
import Button from '~v5/shared/Button';
import Icon from '~shared/Icon';
import styles from './UserHub.module.css';
import { tabList } from './consts';
import UserHubMobile from './UserHubMobile';
import { UserHubProps } from './types';
import TitleLabel from '~v5/shared/TitleLabel';
import { stakesMock } from './partials/StakesTab/consts';

export const displayName = 'common.Extensions.UserHub.partials.UserHub';

const UserHub: FC<UserHubProps> = ({
  transactionAndMessageGroups,
  autoOpenTransaction,
  setAutoOpenTransaction,
  isTransactionTabVisible = false,
}) => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const [selectedTab, setSelectedTab] = useState(0);

  const claimedNotificationNumber = useMemo(
    () => stakesMock.filter(({ status }) => status === 'claimed').length,
    [],
  );

  const handleChange = (selectedOption: number) => {
    setSelectedTab(selectedOption);
  };

  useEffect(() => {
    if (isTransactionTabVisible) {
      setSelectedTab(2);
    }
  }, [isTransactionTabVisible]);

  return (
    <div className={clsx('flex', { 'flex-col': isMobile })}>
      <div className={`${styles.wrapper} ${isMobile ? 'px-0 pt-4' : 'p-6'}`}>
        {!isMobile ? (
          <div>
            <TitleLabel
              className="pb-5"
              text={formatMessage({ id: 'your.colony.overview' })}
            />
            <ul className="-ml-4 -mr-4 flex flex-col">
              {tabList.map(({ value, id, icon, label }) => (
                <li
                  className={`${styles.li} ${
                    selectedTab === id ? 'bg-gray-50' : ''
                  }`}
                  key={value}
                  onClick={() => setSelectedTab(id)}
                  aria-selected={selectedTab === id}
                  role="option"
                  onKeyDown={() => setSelectedTab(id)}
                >
                  <div
                    className={`flex items-center flex-grow mr-2 ${
                      selectedTab === id ? 'font-medium' : ''
                    }`}
                  >
                    <span className="flex shrink-0 mr-2">
                      <Icon name={icon} appearance={{ size: 'tiny' }} />
                    </span>
                    {label}
                  </div>
                  <span className="flex shrink-0 transition-transform duration-normal">
                    <Icon
                      name="caret-right"
                      appearance={{ size: 'extraTiny' }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <UserHubMobile
            selectedTab={selectedTab}
            handleChange={handleChange}
            tabList={tabList}
          />
        )}
        {!isMobile && (
          <div className="mt-2">
            <Button mode="quinary" isFullSize>
              {formatMessage({ id: 'your.dashboard' })}
            </Button>
          </div>
        )}
      </div>
      {isMobile && <span className="divider my-6" />}
      <div
        className={`${
          isMobile ? 'min-w-full' : 'w-full py-6 pl-6 pr-2 relative'
        }`}
      >
        <AnimatePresence>
          <motion.div
            key="stakes-tab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {selectedTab === 0 && <ReputationTab />}
            {selectedTab === 1 && (
              <StakesTab
                claimedNotificationNumber={claimedNotificationNumber}
              />
            )}
            {selectedTab === 2 && (
              <TransactionsTab
                transactionAndMessageGroups={transactionAndMessageGroups}
                autoOpenTransaction={autoOpenTransaction}
                setAutoOpenTransaction={setAutoOpenTransaction}
                appearance={{ interactive: true }}
              />
            )}
          </motion.div>
        </AnimatePresence>
        {isMobile && (
          <div className="mt-6 mb-6 w-full">
            <Button mode="quinary" isFullSize>
              {formatMessage({ id: 'your.dashboard' })}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

UserHub.displayName = displayName;

export default UserHub;
