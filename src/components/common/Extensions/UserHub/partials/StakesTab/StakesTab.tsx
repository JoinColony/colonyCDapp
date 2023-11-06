import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { MotionState as NetworkMotionState } from '@colony/colony-js';

import Tabs from '~shared/Extensions/Tabs';
import { useAppContext, useColonyContext, useMobile } from '~hooks';
import { useGetUserStakesQuery } from '~gql';
import { notNull } from '~utils/arrays';

import { tabsItems } from './consts';
import StakesList from './partials/StakesList';
import { getStakesTabItems } from './helpers';

const displayName = 'common.Extensions.UserHub.partials.StakesTab';

const StakesTab = () => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { walletAddress } = user ?? {};

  const [activeTab, setActiveTab] = useState(0);
  const [motionStatesMap, setMotionStatesMap] = useState<
    Map<string, NetworkMotionState>
  >(new Map());

  const { data, loading: stakesLoading } = useGetUserStakesQuery({
    variables: {
      userAddress: walletAddress ?? '',
    },
    skip: !walletAddress,
    fetchPolicy: 'cache-and-network',
  });
  const userStakes = data?.getUserStakes?.items.filter(notNull) ?? [];

  const handleOnMotionStateFetched = useCallback(
    (stakeId: string, motionState: NetworkMotionState) => {
      setMotionStatesMap((existingMap) =>
        new Map(existingMap).set(stakeId, motionState),
      );
    },
    [],
  );

  /**
   * Count the number of stakes that stake on a motion and compare it to the number of motion
   * states fetched to determine if the states are still loading.
   */
  const motionStakesCount = userStakes.filter(
    (stake) => !!stake.action?.motionData,
  ).length;
  const motionStatesLoading = motionStakesCount > motionStatesMap.size;

  // Tabs are being used for selecting filter option
  const handleOnTabClick = useCallback((_, id: number) => {
    setActiveTab(id);
  }, []);

  const filterOption = tabsItems[activeTab].type;

  // Update tabs items with the number of stakes for each filter option
  const updatedTabsItems = getStakesTabItems(
    tabsItems,
    userStakes,
    filterOption,
    motionStatesMap,
    motionStatesLoading,
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
        items={updatedTabsItems}
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
                stakes={userStakes}
                loading={stakesLoading}
                colony={colony}
                filterOption={filterOption}
                motionStatesMap={motionStatesMap}
                onMotionStateFetched={handleOnMotionStateFetched}
                motionStatesLoading={motionStatesLoading}
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
