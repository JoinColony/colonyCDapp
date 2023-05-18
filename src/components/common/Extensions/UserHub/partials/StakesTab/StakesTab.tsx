import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { AnimatePresence, motion } from 'framer-motion';
import StakesItems from './partials/StakesTabItem';
import { stakesMock, tabsItems } from '~common/Extensions/UserHub/partials/StakesTab/consts';
import Tabs from '~shared/Extensions/Tabs';
import { useMobile } from '~hooks';

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
        (item) => (id === 0 && stakesMock) || item.filterBy === e.target?.childNodes?.[0]?.data?.toLowerCase(),
      );

      setStakesMock(filteredData);
    },
    [stakes],
  );

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="font-semibold text-lg text-gray-900">{formatMessage({ id: 'stakes' })}</div>
        {!isMobile && (
          <button
            type="button"
            className="text-blue-400 font-medium text-xs"
            aria-label={formatMessage({ id: 'claimStakes' })}
          >
            {formatMessage({ id: 'claimStakes' })}
          </button>
        )}
      </div>
      <Tabs items={tabsItems} className="pt-0" activeTab={activeTab} onTabClick={handleOnTabClick}>
        <ul className="flex flex-col">
          <AnimatePresence>
            <motion.div
              key="stakes-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {stakes.map((item) => (
                <StakesItems
                  title={item.title}
                  date={item.date}
                  stake={item.stake}
                  transfer={item.transfer}
                  key={item.key}
                  status={item.status}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </ul>
      </Tabs>
    </div>
  );
};

StakesTab.displayName = displayName;

export default StakesTab;
