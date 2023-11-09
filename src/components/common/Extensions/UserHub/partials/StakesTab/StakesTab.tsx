import React, { FC, useCallback, useState } from 'react';

import { useColonyContext, useMobile } from '~hooks';
import { formatText } from '~utils/intl';
import { SpinnerLoader } from '~shared/Preloaders';
import { stakesFilterOptions } from '~common/Extensions/UserHub/partials/StakesTab/consts';
import Tabs from '~shared/Extensions/Tabs';
import EmptyContent from '~v5/common/EmptyContent';

import StakesTabContentList from './partials/StakesTabContentList';
import ClaimAllButton from './partials/ClaimAllButton/ClaimAllButton';
import { useStakesByFilterType } from './useStakesByFilterType';
import { getStakesTabItems } from './helpers';

const displayName = 'common.Extensions.UserHub.partials.StakesTab';

const StakesTab: FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const isMobile = useMobile();
  const { colony } = useColonyContext();

  const activeFilterOption = stakesFilterOptions[activeTab];

  const { stakesByFilterType, filtersDataLoading, updateClaimedStakesCache } =
    useStakesByFilterType();

  // Tabs are being used for selecting filter option
  const handleOnTabClick = useCallback((_, id: number) => {
    setActiveTab(id);
  }, []);

  // Update tabs items with the number of stakes for each filter option
  const tabItems = getStakesTabItems(
    stakesByFilterType,
    filtersDataLoading,
    activeFilterOption.type,
  );

  const filteredStakes = stakesByFilterType[activeFilterOption.type];
  const filterDataLoading = filtersDataLoading[activeFilterOption.type];

  const claimableStakes = stakesByFilterType.claimable;

  if (!colony) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="heading-5">{formatText({ id: 'stakes' })}</p>
        {!isMobile && (
          <ClaimAllButton
            colonyAddress={colony.colonyAddress}
            claimableStakes={claimableStakes}
            updateClaimedStakesCache={updateClaimedStakesCache}
          />
        )}
      </div>
      <Tabs
        items={tabItems}
        activeTab={activeTab}
        onTabClick={handleOnTabClick}
        className="!pt-0"
      >
        {filterDataLoading ? (
          <div className="mx-auto w-fit">
            <SpinnerLoader appearance={{ size: 'small' }} />
          </div>
        ) : (
          <>
            {filteredStakes.length ? (
              <StakesTabContentList items={filteredStakes} />
            ) : (
              <EmptyContent
                title={{ id: 'empty.content.title.stakes' }}
                description={{ id: 'empty.content.subtitle.stakes' }}
                icon="binoculars"
              />
            )}
          </>
        )}
      </Tabs>
    </div>
  );
};

StakesTab.displayName = displayName;

export default StakesTab;
