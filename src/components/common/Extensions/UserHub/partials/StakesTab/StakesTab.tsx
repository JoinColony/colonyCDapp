import React, { FC, useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { MotionState as NetworkMotionState } from '@colony/colony-js';

import Tabs from '~shared/Extensions/Tabs';
import { useAppContext, useColonyContext, useMobile } from '~hooks';
import { StakesTabProps } from './types';
import { useGetUserStakesQuery } from '~gql';
import { notNull } from '~utils/arrays';

import { tabsItems } from './consts';
import StakesList from './partials/StakesList';

const displayName = 'common.Extensions.UserHub.partials.StakesTab';

const StakesTab: FC<StakesTabProps> = ({ claimedNotificationNumber }) => {
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

  // Tabs are being used for selecting filter option
  const handleOnTabClick = useCallback((_, id: number) => {
    setActiveTab(id);
  }, []);

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

  if (!colony) {
    return null;
  }

  const filterOption = tabsItems[activeTab].type;

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
