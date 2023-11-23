import React from 'react';
import clsx from 'clsx';
import { useColonyContext } from '~hooks';
import {
  useSetPageBreadcrumbs,
  useSetPageHeadingTitle,
} from '~context/PageHeadingContext/hooks';
import { formatText } from '~utils/intl';
import WidgetBoxList from '~v5/common/WidgetBoxList';
import UserAvatars from '~v5/shared/UserAvatars';
import { COLONY_MEMBERS_ROUTE } from '~routes';
import { useGetHomeWidget } from './hooks';
import Numeral from '~shared/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import {
  useCreateTeamBreadcrumbs,
  useGetSelectedTeamFilter,
} from '~hooks/useTeamsBreadcrumbs';

const displayName = 'common.ColonyHome';

const ColonyHome = () => {
  const { colony } = useColonyContext();
  const selectedTeam = useGetSelectedTeamFilter();
  const {
    activeActions,
    allMembers,
    teamColor,
    currentTokenBalance,
    membersLoading,
    nativeToken,
  } = useGetHomeWidget(selectedTeam?.nativeId);
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();

  useSetPageHeadingTitle(formatText({ id: 'colonyHome.title' }));
  useSetPageBreadcrumbs(teamsBreadcrumbs);

  if (!colony) {
    return null;
  }

  return (
    <div>
      <WidgetBoxList
        items={[
          {
            key: '1',
            title: formatText({ id: 'colonyHome.actions' }),
            value: <h4 className="heading-4">{activeActions}</h4>,
            className: clsx('text-base-white', {
              [teamColor]: selectedTeam,
              'bg-gray-900 border-gray-900': !selectedTeam,
            }),
            href: '/',
          },
          {
            key: '2',
            title: formatText({ id: 'colonyHome.members' }),
            value: (
              <h4 className="heading-4">
                {membersLoading ? '-' : allMembers.length}
              </h4>
            ),
            href: COLONY_MEMBERS_ROUTE,
            additionalContent: (
              <UserAvatars
                maxAvatarsToShow={4}
                size="xms"
                items={allMembers}
                showRemainingAvatars={false}
              />
            ),
          },
          {
            key: '3',
            title: formatText({ id: 'colonyHome.funds' }),
            value: (
              <div className="flex items-center gap-2 heading-4">
                <Numeral
                  value={currentTokenBalance}
                  decimals={getTokenDecimalsWithFallback(nativeToken?.decimals)}
                />
                <span className="text-1">{nativeToken?.symbol}</span>
              </div>
            ),
            href: '/',
          },
        ]}
      />
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
