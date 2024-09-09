import { useBell } from '@magicbell/react-headless';
import clsx from 'clsx';
import React, { type FC, useState, useContext } from 'react';
import { defineMessages } from 'react-intl';

import { FeatureFlagsContext } from '~context/FeatureFlagsContext/FeatureFlagsContext.ts';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Select from '~v5/common/Fields/Select/index.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import { tabList } from './consts.ts';
import CountBadge from './partials/CountBadge.tsx';
import CryptoToFiatTab from './partials/CryptoToFiatTab/CryptoToFiatTab.tsx';
import NotificationsTab from './partials/NotificationsTab/NotificationsTab.tsx';
import ReputationTab from './partials/ReputationTab/index.ts';
import StakesTab from './partials/StakesTab/index.ts';
import TransactionsTab from './partials/TransactionsTab/index.ts';
import { UserHubTab } from './types.ts';

// @BETA: Disabled for now
// import { COLONY_HOME_ROUTE } from '~routes';
// @BETA: Disabled for now
// import ButtonLink from '~v5/shared/Button/ButtonLink';

interface Props {
  initialOpenTab?: UserHubTab;
}

const displayName = 'common.Extensions.UserHub.partials.UserHub';

const MSG = defineMessages({
  buttonYourDashboard: {
    id: `${displayName}.buttonYourDashboard`,
    defaultMessage: 'Your dashboard',
  },
  titleColonyOverview: {
    id: `${displayName}.titleColonyOverview`,
    defaultMessage: 'Your overview',
  },
});

const UserHub: FC<Props> = ({ initialOpenTab = UserHubTab.Balance }) => {
  const isMobile = useMobile();
  const featureFlags = useContext(FeatureFlagsContext);
  const [selectedTab, setSelectedTab] = useState(initialOpenTab);

  // @TODO: get from notifications context
  const notificationsServiceIsEnabled = true;

  const { unreadCount } = useBell() || {};

  const filteredTabList = tabList.filter((tabItem) => {
    const isFeatureFlagEnabled =
      !tabItem.featureFlag ||
      (!featureFlags[tabItem.featureFlag]?.isLoading &&
        featureFlags[tabItem.featureFlag]?.isEnabled);

    if (tabItem.id !== UserHubTab.Notifications) {
      return isFeatureFlagEnabled;
    }

    return isFeatureFlagEnabled && notificationsServiceIsEnabled;
  });

  const handleTabChange = (newTab: UserHubTab) => {
    setSelectedTab(newTab);
  };

  // @BETA: Disabled for now
  // const dashboardButton = (
  //   <ButtonLink to={COLONY_HOME_ROUTE} mode="primarySolid" className="w-full">
  //     {formatText(MSG.buttonYourDashboard)}
  //   </ButtonLink>
  // );

  return (
    <div
      className={clsx('flex h-full flex-col sm:w-[42.625rem] sm:flex-row', {
        'sm:h-[27.75rem]':
          selectedTab !== UserHubTab.Balance &&
          selectedTab !== UserHubTab.CryptoToFiat,
        'sm:min-h-[27.75rem]': selectedTab === UserHubTab.Balance,
      })}
    >
      <div className="sticky left-0 right-0 top-0 flex shrink-0 flex-col justify-between border-b border-b-gray-200 bg-base-white px-6 pb-6 pt-4 sm:static sm:left-auto sm:right-auto sm:top-auto sm:w-[216px] sm:border-b-0 sm:border-r sm:border-gray-100 sm:bg-transparent sm:p-6 sm:px-6">
        {isMobile ? (
          <Select
            options={filteredTabList}
            defaultValue={selectedTab}
            value={selectedTab}
            onChange={(value) => handleTabChange(value?.value as UserHubTab)}
            className="w-full"
            hideSelectedOptions
          />
        ) : (
          <>
            <div>
              <TitleLabel
                className="pb-5"
                text={formatText(MSG.titleColonyOverview)}
              />
              <ul className="-ml-4 flex w-[calc(100%+2rem)] flex-col">
                {filteredTabList.map(({ value, id, icon: Icon, label }) => (
                  <li
                    className="w-full"
                    key={value}
                    aria-selected={selectedTab === id}
                    role="option"
                  >
                    <button
                      type="button"
                      onKeyDown={() => setSelectedTab(id)}
                      onClick={() => setSelectedTab(id)}
                      className={clsx(
                        'flex w-full cursor-pointer items-center justify-between rounded p-4 py-2 text-md font-normal leading-5 text-gray-900 transition-all sm:hover:bg-gray-50',
                        {
                          'bg-gray-50': selectedTab === id,
                        },
                      )}
                    >
                      <div
                        className={clsx('mr-2 flex flex-grow items-center', {
                          'font-medium': selectedTab === id,
                        })}
                      >
                        <span className="relative mr-2 flex shrink-0">
                          {id === UserHubTab.Notifications && (
                            <CountBadge count={unreadCount} />
                          )}
                          <Icon size={14} />
                        </span>
                        {formatText(label)}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* @BETA: Disabled for now */}
            {/* <div className="mt-2">{dashboardButton}</div> */}
          </>
        )}
      </div>
      <div className="relative h-full w-full min-w-0 overflow-y-auto">
        {selectedTab === UserHubTab.Balance && (
          <ReputationTab onTabChange={handleTabChange} />
        )}
        {selectedTab === UserHubTab.Notifications && <NotificationsTab />}
        {selectedTab === UserHubTab.Transactions && (
          <TransactionsTab appearance={{ interactive: true }} />
        )}
        {selectedTab === UserHubTab.Stakes && <StakesTab />}
        {selectedTab === UserHubTab.CryptoToFiat && <CryptoToFiatTab />}
      </div>
      {/* @BETA: Disabled for now */}
      {/* {isMobile && ( */}
      {/*   <div className="sticky bottom-0 right-0 left-0 w-full bg-base-white px-6 pb-6"> */}
      {/*     <div className="w-full border-t border-t-gray-200 pt-6"> */}
      {/*       {dashboardButton} */}
      {/*     </div> */}
      {/*   </div> */}
      {/* )} */}
    </div>
  );
};

UserHub.displayName = displayName;

export default UserHub;
