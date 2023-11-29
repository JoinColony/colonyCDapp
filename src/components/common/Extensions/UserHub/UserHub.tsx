import React, { FC, useEffect, useState } from 'react';
import clsx from 'clsx';

import { useMobile } from '~hooks';
import { formatText } from '~utils/intl';
import Icon from '~shared/Icon';
import { COLONY_HOME_ROUTE } from '~routes';
import TitleLabel from '~v5/shared/TitleLabel';
import Select from '~v5/common/Fields/Select';
import ButtonLink from '~v5/shared/Button/ButtonLink';

import ReputationTab from './partials/ReputationTab';
import StakesTab from './partials/StakesTab';
import TransactionsTab from './partials/TransactionsTab';
import { tabList } from './consts';
import { UserHubTabs } from './types';

export const displayName = 'common.Extensions.UserHub.partials.UserHub';

const UserHub: FC = () => {
  const isMobile = useMobile();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (newTab: UserHubTabs) => {
    setSelectedTab(newTab);
  };

  useEffect(() => {
    setSelectedTab(UserHubTabs.Transactions);
  }, []);

  const dashboardButton = (
    <ButtonLink to={COLONY_HOME_ROUTE} mode="primarySolid" className="w-full">
      {formatText({ id: 'your.dashboard' })}
    </ButtonLink>
  );

  return (
    <div
      className={clsx('flex flex-col sm:flex-row h-full sm:w-[42.625rem]', {
        'sm:h-[27.75rem]': selectedTab !== UserHubTabs.Overview,
        'sm:min-h-[27.75rem]': selectedTab === UserHubTabs.Overview,
      })}
    >
      <div className="sticky top-0 left-0 right-0 bg-base-white sm:bg-transparent border-b border-b-gray-200 sm:border-b-0 sm:static sm:top-auto sm:left-auto sm:right-auto flex sm:border-r sm:border-gray-100 flex-col justify-between sm:w-[13.85rem] shrink-0 px-6 pb-6 pt-4 sm:px-6 sm:p-6">
        {isMobile ? (
          <Select
            list={tabList}
            selectedElement={selectedTab}
            handleChange={handleTabChange}
          />
        ) : (
          <>
            <div>
              <TitleLabel
                className="pb-5"
                text={formatText({ id: 'your.colony.overview' })}
              />
              <ul className="-ml-4 w-[calc(100%+2rem)] flex flex-col">
                {tabList.map(({ value, id, icon, label }) => (
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
                        'w-full flex items-center justify-between text-gray-900 font-normal text-md leading-5 rounded cursor-pointer transition-all sm:hover:bg-gray-50 p-4 py-2',
                        {
                          'bg-gray-50': selectedTab === id,
                        },
                      )}
                    >
                      <div
                        className={clsx('flex items-center flex-grow mr-2', {
                          'font-medium': selectedTab === id,
                        })}
                      >
                        <span className="flex shrink-0 mr-2">
                          <Icon name={icon} appearance={{ size: 'tiny' }} />
                        </span>
                        {label}
                      </div>
                      <span className="flex shrink-0 transition-transform duration-normal">
                        <Icon
                          name="caret-right"
                          appearance={{ size: 'extraTiny' }}
                        />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2">{dashboardButton}</div>
          </>
        )}
      </div>
      <div
        className={clsx('h-full overflow-auto w-full p-6 relative', {
          'sm:pr-2': selectedTab === UserHubTabs.Transactions,
        })}
      >
        {selectedTab === UserHubTabs.Overview && (
          <ReputationTab onTabChange={handleTabChange} />
        )}
        {selectedTab === UserHubTabs.Stakes && <StakesTab />}
        {selectedTab === UserHubTabs.Transactions && (
          <TransactionsTab appearance={{ interactive: true }} />
        )}
      </div>
      {isMobile && (
        <div className="sticky bottom-0 right-0 left-0 w-full bg-base-white px-6 pb-6">
          <div className="w-full border-t border-t-gray-200 pt-6">
            {dashboardButton}
          </div>
        </div>
      )}
    </div>
  );
};

UserHub.displayName = displayName;

export default UserHub;
