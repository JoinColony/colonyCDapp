import React, { FC, useEffect, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import {
  Outlet,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';

import { useMemberModalContext } from '~context';
import {
  COLONY_CONTRIBUTORS_ROUTE,
  COLONY_MEMBERS_ROUTE,
} from '~routes/routeConstants';
import Tabs from '~shared/Extensions/Tabs';
import { formatText } from '~utils/intl';
import Filter from '~v5/common/Filter';
import { FilterTypes } from '~v5/common/TableFiltering/types';
import BurgerMenu from '~v5/shared/BurgerMenu';
import PopoverBase from '~v5/shared/PopoverBase';

import { useMembersPage } from './hooks';
import { MembersTabContentWrapper } from './partials/MembersTabContent';
import SubNavigation from './partials/SubNavigation';

const displayName = 'v5.pages.MembersPage';

const MembersPage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const resolvedMembersPath = useResolvedPath(COLONY_MEMBERS_ROUTE);
  const resolvedContributorsPath = useResolvedPath(COLONY_CONTRIBUTORS_ROUTE);
  const [activeTab, setActiveTab] = useState(0);
  const { sortedContributorCount, sortedMemberCount } = useMembersPage();
  const {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible: isSubNavigationOpen,
  } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'bottom-start',
    trigger: 'click',
    interactive: true,
    closeOnOutsideClick: true,
  });
  const { setIsMemberModalOpen } = useMemberModalContext();

  const titleAction = (
    <>
      <BurgerMenu isVertical setTriggerRef={setTriggerRef} />
      {isSubNavigationOpen && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          withTooltipStyles={false}
          cardProps={{
            rounded: 's',
            hasShadow: true,
            className: 'py-4 px-2.5',
          }}
          classNames="w-full sm:max-w-[17.375rem]"
        >
          <SubNavigation
            onManageMembersClick={() => setIsMemberModalOpen(true)}
          />
        </PopoverBase>
      )}
    </>
  );

  useEffect(() => {
    if (pathname === resolvedMembersPath.pathname) {
      setActiveTab(1);
    } else if (pathname === resolvedContributorsPath.pathname) {
      setActiveTab(0);
    }
  }, [
    pathname,
    resolvedContributorsPath.pathname,
    resolvedMembersPath.pathname,
  ]);

  return (
    <Tabs
      activeTab={activeTab}
      onTabClick={(_, id) =>
        navigate(id === 0 ? COLONY_CONTRIBUTORS_ROUTE : COLONY_MEMBERS_ROUTE)
      }
      items={[
        {
          id: 0,
          title: formatText({ id: 'membersPage.contributing' }),
          notificationNumber: sortedContributorCount,
          content: (
            <MembersTabContentWrapper
              title={formatText({ id: 'membersPage.contributing.title' })}
              description={formatText({
                id: 'membersPage.contributing.description',
              })}
              additionalActions={
                <Filter excludeFilterType={FilterTypes.Team} />
              }
              titleAction={titleAction}
            >
              <Outlet />
            </MembersTabContentWrapper>
          ),
        },
        {
          id: 1,
          title: formatText({ id: 'membersPage.allMembers' }),
          notificationNumber: sortedMemberCount,
          content: (
            <MembersTabContentWrapper
              title={formatText({ id: 'membersPage.allMembers.title' })}
              description={formatText({
                id: 'membersPage.allMembers.description',
              })}
              additionalActions={
                <Filter excludeFilterType={FilterTypes.Team} />
              }
              titleAction={titleAction}
            >
              <Outlet />
            </MembersTabContentWrapper>
          ),
        },
      ]}
    />
  );
};

MembersPage.displayName = displayName;

export default MembersPage;
