import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { AnimatePresence, motion } from 'framer-motion';

import Tabs from '~shared/Extensions/Tabs';
import { useAppContext, useColonyContext, useMobile } from '~hooks';
import { useGetUserStakesQuery } from '~gql';
import { notNull } from '~utils/arrays';
import { UserStakeWithStatus } from '~types';
import { useNetworkMotionStates } from '~hooks/useNetworkMotionState';

import { stakesFilterOptions } from './consts';
import StakesList from './partials/StakesList';
import { getStakeStatus, getStakesTabItems } from './helpers';
import { StakesFilterType } from './types';

const displayName = 'common.Extensions.UserHub.partials.StakesTab';

const StakesTab = () => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { walletAddress } = user ?? {};

  const [activeTab, setActiveTab] = useState(0);
  const activeFilterOption = stakesFilterOptions[activeTab];

  const { data, loading: stakesLoading } = useGetUserStakesQuery({
    variables: {
      userAddress: walletAddress ?? '',
    },
    skip: !walletAddress,
    fetchPolicy: 'cache-and-network',
  });
  const userStakes = useMemo(
    () => data?.getUserStakes?.items.filter(notNull) ?? [],
    [data],
  );

  const motionIds = useMemo(
    () =>
      userStakes
        .filter((stake) => !!stake.action?.motionData)
        .map((stake) => stake.action?.motionData?.nativeMotionId ?? ''),
    [userStakes],
  );
  const { motionStatesMap, loading: motionStatesLoading } =
    useNetworkMotionStates(motionIds);

  const stakesWithStatus = userStakes.map((stake) => ({
    ...stake,
    status: getStakeStatus(stake, motionStatesMap),
  }));
  const stakesByFilterType = stakesFilterOptions.reduce((stakes, option) => {
    const updatedStakes = {
      ...stakes,
      [option.type]: stakesWithStatus.filter((stake) =>
        option.stakeStatuses.includes(stake.status),
      ),
    };

    return updatedStakes;
  }, {} as Record<StakesFilterType, UserStakeWithStatus[]>);

  // Tabs are being used for selecting filter option
  const handleOnTabClick = useCallback((_, id: number) => {
    setActiveTab(id);
  }, []);

  // Update tabs items with the number of stakes for each filter option
  const tabItems = getStakesTabItems(
    stakesByFilterType,
    motionStatesLoading,
    activeFilterOption.type,
  );

  const filteredStakes = stakesByFilterType[activeFilterOption.type];
  const filterDataLoading = !!(
    stakesLoading ||
    (activeFilterOption.requiresMotionState && motionStatesLoading)
  );

  if (!colony) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="heading-5">{formatMessage({ id: 'stakes' })}</p>
        {!isMobile && (
          <button
            type="button"
            className="text-blue-400 text-4 hover:text-gray-900 transition-all duration-normal"
            aria-label={formatMessage({ id: 'claimStakes' })}
          >
            {/* @TODO handle action here */}
            {formatMessage({ id: 'claimStakes' })}
          </button>
        )}
      </div>
      <Tabs
        items={tabItems}
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
              <StakesList
                stakes={filteredStakes}
                loading={filterDataLoading}
                colony={colony}
              />
            </motion.div>
          </AnimatePresence>
        </ul>
      </Tabs>
    </div>
  );
};

StakesTab.displayName = displayName;

export default StakesTab;
