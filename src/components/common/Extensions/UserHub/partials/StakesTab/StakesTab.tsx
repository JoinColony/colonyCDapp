import React, { FC, useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { AnimatePresence, motion } from 'framer-motion';

import { tabsItems } from '~common/Extensions/UserHub/partials/StakesTab/consts';
import Tabs from '~shared/Extensions/Tabs';
import { useAppContext, useColonyContext, useMobile } from '~hooks';
import EmptyContent from '~v5/common/EmptyContent';
import { StakesTabProps } from './types';
import { useGetUserStakesQuery } from '~gql';
import { notNull } from '~utils/arrays';

import StakesTabItem from './partials/StakesTabItem';

const displayName = 'common.Extensions.UserHub.partials.StakesTab';

const StakesTab: FC<StakesTabProps> = ({ claimedNotificationNumber }) => {
  const [activeTab, setActiveTab] = useState(0);
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const { walletAddress } = user ?? {};

  const { data } = useGetUserStakesQuery({
    variables: {
      userAddress: walletAddress ?? '',
    },
    skip: !walletAddress,
    fetchPolicy: 'cache-and-network',
  });
  const userStakes = data?.getUserStakes?.items.filter(notNull);

  const handleOnTabClick = useCallback((e, id: number) => {
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
              {userStakes?.length ? (
                userStakes.map((stake) => (
                  <StakesTabItem
                    key={stake.id}
                    title={stake.action?.type.toString() ?? ''}
                    date={stake.createdAt}
                    stake={stake.amount}
                    transfer=""
                    status={stake.isClaimed ? 'claimed' : 'staking'}
                    userStake={stake}
                    nativeToken={colony.nativeToken}
                    colonyAddress={colony.colonyAddress}
                  />
                ))
              ) : (
                <EmptyContent
                  title={{ id: 'empty.content.title.stakes' }}
                  description={{ id: 'empty.content.subtitle.stakes' }}
                  icon="binoculars"
                />
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
