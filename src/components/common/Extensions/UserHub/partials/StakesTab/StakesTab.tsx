import { Binoculars } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import Tabs from '~shared/Extensions/Tabs/index.ts';
import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';

import { stakesFilterOptions } from './consts.ts';
import { getStakesTabItems } from './helpers.ts';
import ClaimAllButton from './partials/ClaimAllButton.tsx';
import StakesList from './partials/StakesList.tsx';
import { useStakesByFilterType } from './useStakesByFilterType.ts';

const displayName = 'common.Extensions.UserHub.partials.StakesTab';

const StakesTab = () => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { colony } = useColonyContext();

  const [activeTab, setActiveTab] = useState(0);
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

  return (
    <div
      className={clsx('p-6 sm:p-0', {
        'flex h-full flex-col': !filteredStakes.length,
      })}
    >
      <div className="mb-4 flex items-center justify-between sm:px-6 sm:pt-6">
        <p className="heading-5">{formatMessage({ id: 'stakes' })}</p>
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
        upperContainerClassName="sm:px-6"
        className={!filteredStakes.length ? 'flex-1' : undefined}
      >
        <ul
          className={clsx('flex flex-col', {
            'h-full': !filteredStakes.length,
          })}
        >
          {!filteredStakes.length ? (
            <EmptyContent
              title={{ id: 'empty.content.title.stakes' }}
              description={{ id: 'empty.content.subtitle.stakes' }}
              icon={Binoculars}
              className="h-full"
            />
          ) : (
            <AnimatePresence>
              <motion.div
                key="stakes-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <StakesList
                  stakes={filteredStakes}
                  loading={filterDataLoading}
                  colony={colony}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </ul>
      </Tabs>
    </div>
  );
};

StakesTab.displayName = displayName;

export default StakesTab;
