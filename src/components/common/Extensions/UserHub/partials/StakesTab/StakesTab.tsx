import React, { FC, useCallback, useMemo, useState } from 'react';

import {
  stakesMock,
  tabsItems,
} from '~common/Extensions/UserHub/partials/StakesTab/consts';
import Tabs from '~shared/Extensions/Tabs';
import { useMobile } from '~hooks';
import EmptyContent from '~v5/common/EmptyContent';
import { StakesTabProps } from './types';
import { formatText } from '~utils/intl';
import StakesTabContentList from './partials/StakesTabContentList';

const displayName = 'common.Extensions.UserHub.partials.StakesTab';

const StakesTab: FC<StakesTabProps> = ({ claimedNotificationNumber }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [stakes, setStakesMock] = useState(stakesMock);
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

  const updatedTabsItems = useMemo(
    () =>
      tabsItems.map((item) =>
        item.type === 'claimable'
          ? Object.assign(item, {
              notificationNumber: claimedNotificationNumber,
            })
          : item,
      ),
    [claimedNotificationNumber],
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="heading-5">{formatText({ id: 'stakes' })}</p>
        {!isMobile && (
          <button
            type="button"
            className="text-blue-400 text-4 hover:text-gray-900 transition-all duration-normal"
            aria-label={formatText({ id: 'claimStakes' })}
          >
            {/* @TODO handle action here */}
            {formatText({ id: 'claimStakes' })}
          </button>
        )}
      </div>
      <Tabs
        items={updatedTabsItems}
        activeTab={activeTab}
        onTabClick={handleOnTabClick}
        className="!pt-0"
      >
        {stakes.length ? (
          <StakesTabContentList items={stakes} />
        ) : (
          <EmptyContent
            title={{ id: 'empty.content.title.stakes' }}
            description={{ id: 'empty.content.subtitle.stakes' }}
            icon="binoculars"
          />
        )}
      </Tabs>
    </div>
  );
};

StakesTab.displayName = displayName;

export default StakesTab;
