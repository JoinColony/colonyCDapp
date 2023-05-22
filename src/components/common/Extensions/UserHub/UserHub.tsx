import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useIntl } from 'react-intl';
import { useMobile } from '~hooks';
import ReputationTab from './partials/ReputationTab';
import StakesTab from './partials/StakesTab';
import TransactionsTab from './partials/TransactionsTab';
import { transactionsItems } from '~common/Extensions/UserHub/partials/TransactionsTab/consts';
import Button from '~shared/Extensions/Button';
import Icon from '~shared/Icon';
import styles from './UserHub.module.css';
import { tabList } from './consts';
import UserHubMobile from './UserHubMobile';

export const displayName = 'common.Extensions.UserHub.partials.UserHub';

const UserHub = () => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (selectedOption: number) => {
    setSelectedTab(selectedOption);
  };

  return (
    <div className={`${isMobile ? 'flex-col' : 'flex-row'} flex`}>
      <div className={`flex pt-6 border-r border-gray-100 flex-col justify-between ${!isMobile ? 'px-2' : 'px-0'}`}>
        {!isMobile ? (
          <div>
            <div className="text-gray-400 font-medium text-xs uppercase px-4 pb-5">
              {formatMessage({ id: 'your.colony.overview' })}
            </div>
            <ul className="min-w-[12.5rem] flex flex-col">
              {tabList.map((item) => (
                <li
                  className={styles.li}
                  key={item.value}
                  onClick={() => setSelectedTab(item.id)}
                  aria-selected={selectedTab === item.id}
                  role="option"
                  onKeyDown={() => setSelectedTab(item.id)}
                >
                  <div className="flex items-center">
                    <Icon name={item.icon} appearance={{ size: 'normal' }} className={`${styles.icon}  mr-2`} />
                    {item.label}
                  </div>
                  <Icon
                    name="caret-right"
                    className={`${styles.iconArrow} transition-transform duration-normal ${
                      selectedTab === item.id ? 'rotate-90' : 'rotate-0'
                    }`}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <UserHubMobile selectedTab={selectedTab} handleChange={handleChange} tabList={tabList} />
        )}
        {!isMobile && <Button mode="secondaryOutline">{formatMessage({ id: 'your.dashboard' })}</Button>}
      </div>
      {isMobile && <div className="h-[0.0625rem] w-full bg-gray-200 mt-6 mb-6" />}
      <div className={`${!isMobile ? 'min-w-[29.125rem] py-4 p-6' : 'min-w-full'}`}>
        <AnimatePresence>
          <motion.div
            key="stakes-tab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {selectedTab === 0 && <ReputationTab />}
            {selectedTab === 1 && <StakesTab />}
            {selectedTab === 2 && <TransactionsTab items={transactionsItems} />}
          </motion.div>
        </AnimatePresence>
        {isMobile && (
          <div className="mt-6 mb-6 w-full">
            <Button mode="secondaryOutline" isFullSize>
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
