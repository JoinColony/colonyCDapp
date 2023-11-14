import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { AnimatePresence, motion } from 'framer-motion';

import Tabs from '~shared/Extensions/Tabs';
import {
  useAppContext,
  useAsyncFunction,
  useColonyContext,
  useEnabledExtensions,
  useMobile,
} from '~hooks';
import { ActionTypes } from '~redux';

import { stakesFilterOptions } from './consts';
import StakesList from './partials/StakesList';
import { getStakesTabItems } from './helpers';
import { useStakesByFilterType } from './useStakesByFilterType';

const displayName = 'common.Extensions.UserHub.partials.StakesTab';

const StakesTab = () => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { votingReputationAddress } = useEnabledExtensions();

  const [activeTab, setActiveTab] = useState(0);
  const activeFilterOption = stakesFilterOptions[activeTab];

  const { stakesByFilterType, filtersDataLoading } = useStakesByFilterType();

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

  const claimAll = useAsyncFunction({
    submit: ActionTypes.MOTION_CLAIM_ALL,
    error: ActionTypes.MOTION_CLAIM_ALL_ERROR,
    success: ActionTypes.MOTION_CLAIM_ALL_SUCCESS,
  });

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
            onClick={() =>
              claimAll({
                userAddress: user?.walletAddress ?? '',
                colonyAddress: colony.colonyAddress,
                extensionAddress: votingReputationAddress ?? '',
                motionIds: claimableStakes.map(
                  (stake) => stake.action?.motionData?.id ?? '',
                ),
              })
            }
          >
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
