import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { AnimatePresence, motion } from 'framer-motion';

import StakesItems from './partials/StakesTabItem';
import {
  stakesMock,
  tabsItems,
} from '~common/Extensions/UserHub/partials/StakesTab/consts';
import Tabs from '~shared/Extensions/Tabs';
import { useMobile } from '~hooks';
import EmptyContent from '../EmptyContent';

const displayName = 'common.Extensions.UserHub.partials.StakesTab';

const StakesTab = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stakes, setStakesMock] = useState(stakesMock);
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  // @TODO: display data from API

  const handleOnTabClick = useCallback(
    (e, id: number) => {
      setActiveTab(id);
      const [...filteredData] = stakes.filter(
        (item) =>
          (id === 0 && stakesMock) ||
          item.filterBy === e.target?.childNodes?.[0]?.data?.toLowerCase(),
      );

      setStakesMock(filteredData);
    },
    [stakes],
  );

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <div className="font-semibold text-lg text-gray-900">
          {formatMessage({ id: 'stakes' })}
        </div>
        {!isMobile && (
          <button
            type="button"
            className="text-blue-400 font-medium text-xs hover:text-gray-900 transition-all duration-normal"
            aria-label={formatMessage({ id: 'claimStakes' })}
          >
            {formatMessage({ id: 'claimStakes' })}
          </button>
        )}
      </div>
      <Tabs
        items={tabsItems}
        className="pt-0"
        activeTab={activeTab}
        onTabClick={handleOnTabClick}
      >
        <ul className="flex flex-col">
          <AnimatePresence>
            <motion.div
              key="stakes-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {stakes.length ? (
                stakes.map(({ title, date, stake, transfer, status, key }) => (
                  <StakesItems
                    title={title}
                    date={date}
                    stake={stake}
                    transfer={transfer}
                    key={key}
                    status={status}
                  />
                ))
              ) : (
                <EmptyContent contentName="stakes" />
              )}
            </motion.div>
          </AnimatePresence>
        </ul>
      </Tabs>
    </div>
  );
};

StakesTab.displayName = displayName;

export default StakesTab;
