import React, { FC, useEffect, useState } from 'react';
import clsx from 'clsx';

import { COLONY_HOME_ROUTE } from '~routes/routeConstants';
import { useMobile } from '~hooks';
import { formatText } from '~utils/intl';
import Icon from '~shared/Icon';
import TitleLabel from '~v5/shared/TitleLabel';
import Select from '~v5/common/Fields/Select';
import ButtonLink from '~v5/shared/Button/ButtonLink';

import ReputationTab from '../ReputationTab';
import StakesTab from '../StakesTab';
import TransactionsTab from '../TransactionsTab';
import {
  UserHubContentProps,
  UserHubNavigationItem,
  UserHubTabs,
} from './types';
import { tabList } from './consts';

export const displayName = 'common.Extensions.UserHub.partials.UserHubContent';

const UserHubContent: FC<UserHubContentProps> = ({
  isTransactionTabVisible,
}) => {
  const isMobile = useMobile();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (newTab: UserHubTabs) => {
    setSelectedTab(newTab);
  };

  useEffect(() => {
    if (isTransactionTabVisible) {
      setSelectedTab(2);
      setSelectedTab(UserHubTabs.Transactions);
    }
  }, [isTransactionTabVisible]);

  const dashboardButton = (
    // @todo: replace with correct link
    <ButtonLink
      to={COLONY_HOME_ROUTE}
      mode="primarySolid"
      className="w-full sm:mt-2"
    >
      {formatText({ id: 'your.dashboard' })}
    </ButtonLink>
  );

  return (
    <div className="flex flex-col sm:flex-row h-full relative overflow-auto sm:h-auto w-full sm:w-auto">
      <div className="flex flex-col sm:justify-between sm:w-[13.85rem] sm:min-h-[27.75rem] shrink-0 px-6 sm:py-6 sm:border-r sm:border-gray-100 sticky top-0 left-0 right-0 bg-base-white pb-6 pt-6 border-b border-b-gray-200 sm:border-0 sm:static sm:top-auto sm:left-auto sm:right-auto sm:bg-transparent z-10">
        {isMobile ? (
          <Select<UserHubNavigationItem[]>
            list={tabList}
            selectedElement={selectedTab}
            handleChange={handleTabChange}
          />
        ) : (
          <>
            <div>
              <TitleLabel
                className="mb-5"
                text={formatText({ id: 'your.colony.overview' })}
              />
              <ul className="flex flex-col -mx-4 w-[calc(100%+2rem)]">
                {tabList.map(({ id, icon, label }) => (
                  <li key={id} aria-selected={selectedTab === id} role="option">
                    <button
                      type="button"
                      className={clsx(
                        'flex items-center justify-between gap-2 text-gray-900 text-md rounded transition-all md:hover:bg-gray-50 py-2 px-4 w-full',
                        {
                          'bg-gray-50 font-medium': selectedTab === id,
                        },
                      )}
                      onClick={() => setSelectedTab(id)}
                      onKeyDown={() => setSelectedTab(id)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex-shrink-0">
                          <Icon name={icon} appearance={{ size: 'tiny' }} />
                        </span>
                        {label}
                      </span>
                      <span className="flex-shrink-0">
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
            {dashboardButton}
          </>
        )}
      </div>
      <div
        className={clsx('p-6 flex-grow w-full sm:relative', {
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
      {isMobile ? (
        <div className="w-full sticky bottom-0 left-0 right-0 bg-base-white px-6 pb-6">
          <div className="w-full border-t border-t-gray-200 pt-6">
            {dashboardButton}
          </div>
        </div>
      ) : null}
    </div>
  );
};

UserHubContent.displayName = displayName;

export default UserHubContent;
