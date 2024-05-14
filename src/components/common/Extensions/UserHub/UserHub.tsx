import { CaretRight } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, useState } from 'react';
import { defineMessages } from 'react-intl';

import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Select from '~v5/common/Fields/Select/index.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import { tabList } from './consts.ts';
import ReputationTab from './partials/ReputationTab/index.ts';
import StakesTab from './partials/StakesTab/index.ts';
import TransactionsTab from './partials/TransactionsTab/index.ts';
import { type UserHubProps, UserHubTabs } from './types.ts';

// @BETA: Disabled for now
// import { COLONY_HOME_ROUTE } from '~routes';
// @BETA: Disabled for now
// import ButtonLink from '~v5/shared/Button/ButtonLink';

const displayName = 'common.Extensions.UserHub.partials.UserHub';

const MSG = defineMessages({
  buttonYourDashboard: {
    id: `${displayName}.buttonYourDashboard`,
    defaultMessage: 'Your dashboard',
  },
  titleColonyOverview: {
    id: `${displayName}.titleColonyOverview`,
    defaultMessage: 'Your Colony overview',
  },
});

const UserHub: FC<UserHubProps> = ({
  defaultOpenedTab = UserHubTabs.Balance,
}) => {
  const isMobile = useMobile();
  const [selectedTab, setSelectedTab] = useState(defaultOpenedTab);

  const handleTabChange = (newTab: UserHubTabs) => {
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
        'sm:h-[27.75rem]': selectedTab !== UserHubTabs.Balance,
        'sm:min-h-[27.75rem]': selectedTab === UserHubTabs.Balance,
      })}
    >
      <div className="sticky left-0 right-0 top-0 flex shrink-0 flex-col justify-between border-b border-b-gray-200 bg-base-white px-6 pb-6 pt-4 sm:static sm:left-auto sm:right-auto sm:top-auto sm:w-[13.85rem] sm:border-b-0 sm:border-r sm:border-gray-100 sm:bg-transparent sm:p-6 sm:px-6">
        {isMobile ? (
          <Select
            options={tabList}
            defaultValue={selectedTab}
            value={selectedTab}
            onChange={(value) => handleTabChange(value?.value as UserHubTabs)}
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
                {tabList.map(({ value, id, icon: Icon, label }) => (
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
                        <span className="mr-2 flex shrink-0">
                          <Icon size={14} />
                        </span>
                        {formatText(label)}
                      </div>
                      <span className="flex shrink-0 transition-transform duration-normal">
                        <CaretRight size={12} />
                      </span>
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
      <div className={clsx('relative h-full w-full')}>
        {selectedTab === UserHubTabs.Balance && (
          <ReputationTab onTabChange={handleTabChange} />
        )}
        {selectedTab === UserHubTabs.Stakes && <StakesTab />}
        {selectedTab === UserHubTabs.Transactions && (
          <TransactionsTab appearance={{ interactive: true }} />
        )}
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
