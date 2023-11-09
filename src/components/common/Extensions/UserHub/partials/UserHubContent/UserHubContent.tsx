import React, { FC, useState } from 'react';
import clsx from 'clsx';

import { useMobile } from '~hooks';
import ReputationTab from '../ReputationTab';
import StakesTab from '../StakesTab';
import TransactionsTab from '../TransactionsTab';
import Icon from '~shared/Icon';
import { tabList } from './consts';
import { UserHubNavigationItem } from './types';
import TitleLabel from '~v5/shared/TitleLabel';
import { stakesMock } from '../StakesTab/consts';
import Select from '~v5/common/Fields/Select';
import { formatText } from '~utils/intl';
import ButtonLink from '~v5/shared/Button/ButtonLink';

export const displayName = 'common.Extensions.UserHub.partials.UserHubContent';

const UserHubContent: FC = () => {
  const isMobile = useMobile();
  const [selectedTab, setSelectedTab] = useState(0);

  const claimedNotificationNumber = stakesMock.filter(
    ({ status }) => status === 'claimed',
  ).length;

  const dashboardButton = (
    // @todo: replace with correct link
    <ButtonLink to="/" mode="quinary" className="w-full mt-6 sm:mt-2">
      {formatText({ id: 'your.dashboard' })}
    </ButtonLink>
  );

  return (
    <div className="flex flex-col sm:flex-row h-full relative overflow-auto sm:h-auto">
      <div className="flex flex-col sm:justify-between sm:w-[13.85rem] sm:min-h-[27.75rem] shrink-0 px-6 sm:py-6 sm:border-r sm:border-gray-100 sticky top-0 left-0 right-0 bg-base-white pb-6 pt-6 border-b border-b-gray-200 sm:border-0 sm:static sm:top-auto sm:left-auto sm:right-auto sm:bg-transparent">
        {isMobile ? (
          <Select<UserHubNavigationItem[]>
            list={tabList}
            selectedElement={selectedTab}
            handleChange={setSelectedTab}
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
        className={clsx('p-6 w-full sm:relative', {
          'sm:pr-2': selectedTab === 2,
        })}
      >
        {selectedTab === 0 && <ReputationTab />}
        {selectedTab === 1 && (
          <StakesTab claimedNotificationNumber={claimedNotificationNumber} />
        )}
        {selectedTab === 2 && (
          <TransactionsTab appearance={{ interactive: true }} />
        )}
        {isMobile ? dashboardButton : null}
      </div>
    </div>
  );
};

UserHubContent.displayName = displayName;

export default UserHubContent;
