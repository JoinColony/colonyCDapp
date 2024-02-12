import {
  ChartLine,
  // @todo: uncomment when decisions page will be ready
  // Handshake,
  Layout,
  Pencil,
  PresentationChart,
  Users,
} from '@phosphor-icons/react';
import React, { useCallback } from 'react';

import { ACTION } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/index.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { useMemberContext } from '~context/MemberContext.tsx';
import { useActivityData } from '~hooks/useActivityData.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_BALANCES_ROUTE,
  COLONY_CONTRIBUTORS_ROUTE,
  // @todo: uncomment when decisions page will be ready
  // COLONY_DECISIONS_ROUTE,
  TEAM_SEARCH_PARAM,
} from '~routes/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import { getBalanceForTokenAndDomain } from '~utils/tokens.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.tsx';
import {
  type TeamCardListItem,
  type TeamCardListProps,
} from '~v5/common/TeamCardList/types.ts';
import Link from '~v5/shared/Link/index.ts';

import { getMembersList } from '../MembersPage/utils.ts';

export const useTeams = (): TeamCardListProps['items'] => {
  const { colony } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const { domains, balances, nativeToken, name: colonyName } = colony || {};

  const { totalContributors: members, loading: membersLoading } =
    useMemberContext();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const { domainsActionCount } = useActivityData();

  const getDomainMembers = useCallback(
    (teamId: number): TeamCardListItem['members'] => {
      const membersList = getMembersList(members, teamId, colony);

      return membersList.reduce((result, item) => {
        if (!item) {
          return result;
        }

        const { userAvatarProps, role, reputation } = item;
        const { user } = userAvatarProps;

        if (!user || (!role && !reputation)) {
          return result;
        }

        return [...result, user];
      }, []);
    },
    [colony, members],
  );

  const teams =
    domains?.items.reduce<TeamCardListItem[]>((result, item) => {
      if (!item) {
        return result;
      }

      const { metadata, id, nativeId, reputationPercentage } = item;

      if (!metadata) {
        return result;
      }

      if (selectedDomain && selectedDomain.nativeId !== nativeId) {
        return result;
      }

      const { color, description, name } = metadata;

      const domainActionsCount = domainsActionCount?.find(
        ({ key }) => key === id,
      )?.docCount;
      const hasActions = domainActionsCount && domainActionsCount > 0;

      return [
        ...result,
        {
          key: id,
          title: name,
          description,
          teamProps: {
            color,
            name,
          },
          members: getDomainMembers(nativeId),
          isMembersListLoading: membersLoading,
          reputation: reputationPercentage ? Number(reputationPercentage) : 0,
          balance: (
            <Numeral
              value={
                getBalanceForTokenAndDomain(
                  balances,
                  nativeToken?.tokenAddress || '',
                  nativeId,
                ) || 0
              }
              decimals={nativeToken?.decimals}
              suffix={` ${nativeToken?.symbol}`}
            />
          ),
          meatBallMenuProps: {
            items: [
              {
                key: '1',
                icon: Pencil,
                label: formatText({ id: 'teamsPage.menu.editTeam' }),
                onClick: () =>
                  toggleActionSidebarOn({
                    [ACTION_TYPE_FIELD_NAME]: ACTION.EDIT_EXISTING_TEAM,
                    team: nativeId,
                  }),
              },
              {
                key: '2',
                icon: Users,
                label: formatText({ id: 'teamsPage.menu.viewTeamMembers' }),
                renderItemWrapper: (props, children) => (
                  <Link
                    to={{
                      pathname: `/${colonyName}/${COLONY_CONTRIBUTORS_ROUTE}`,
                      search: `?${TEAM_SEARCH_PARAM}=${nativeId}`,
                    }}
                    {...props}
                  >
                    {children}
                  </Link>
                ),
              },
              {
                key: '3',
                icon: PresentationChart,
                label: formatText({ id: 'teamsPage.menu.viewTeamActivity' }),
                renderItemWrapper: (props, children) => (
                  <Link
                    to={{
                      pathname: `/${colonyName}/${COLONY_ACTIVITY_ROUTE}`,
                      search: `?${TEAM_SEARCH_PARAM}=${nativeId}`,
                    }}
                    {...props}
                  >
                    {children}
                  </Link>
                ),
              },
              {
                key: '4',
                icon: ChartLine,
                label: formatText({ id: 'teamsPage.menu.viewTeamFunds' }),
                renderItemWrapper: (props, children) => (
                  <Link
                    to={{
                      pathname: `/${colonyName}/${COLONY_BALANCES_ROUTE}`,
                      search: `?${TEAM_SEARCH_PARAM}=${nativeId}`,
                    }}
                    {...props}
                  >
                    {children}
                  </Link>
                ),
              },
              // @todo: uncomment when decisions page will be ready
              // {
              //   key: '5',
              //   icon: Handshake,
              //   label: formatText({ id: 'teamsPage.menu.viewTeamDecisions' }),
              //   renderItemWrapper: (props, children) => (
              //     <Link
              //       to={{
              //         pathname: `/${colonyName}/${COLONY_DECISIONS_ROUTE}`,
              //         search: `?${TEAM_SEARCH_PARAM}=${nativeId}`,
              //       }}
              //       {...props}
              //     >
              //       {children}
              //     </Link>
              //   ),
              // },
              {
                key: '6',
                icon: Layout,
                label: formatText({ id: 'teamsPage.menu.viewTeamDashboard' }),
                renderItemWrapper: (props, children) => (
                  <Link
                    to={{
                      pathname: `/${colonyName}`,
                      search: `?${TEAM_SEARCH_PARAM}=${nativeId}`,
                    }}
                    {...props}
                  >
                    {children}
                  </Link>
                ),
              },
            ],
          },
          links: [
            // @todo: uncomment when agreements page is ready and replace with correct link
            // {
            //   key: '1',
            //   to: '/',
            //   text: formatText({ id: 'teamsPage.links.agreements' }),
            // },
            ...(hasActions
              ? [
                  {
                    key: '2',
                    to: {
                      pathname: `/${colonyName}/${COLONY_ACTIVITY_ROUTE}`,
                      search: `?${TEAM_SEARCH_PARAM}=${nativeId}`,
                    },
                    text: formatText({ id: 'teamsPage.links.activity' }),
                  },
                ]
              : []),
          ],
        },
      ];
    }, []) || [];

  return teams.sort((a, b) => (a.reputation > b.reputation ? -1 : 1));
};
