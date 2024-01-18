import {
  ChartLine,
  // @todo: uncomment when decisions page will be ready
  // Handshake,
  Layout,
  Pencil,
  PresentationChart,
  Users,
} from 'phosphor-react';
import React, { useCallback } from 'react';

import { ACTION } from '~constants/actions';
import { useActionSidebarContext } from '~context';
import { useMemberContext } from '~context/MemberContext';
import { useColonyContext, useGetSelectedDomainFilter } from '~hooks';
import { useActivityData } from '~hooks/useActivityData';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_BALANCES_ROUTE,
  COLONY_CONTRIBUTORS_ROUTE,
  // @todo: uncomment when decisions page will be ready
  // COLONY_DECISIONS_ROUTE,
  TEAM_SEARCH_PARAM,
} from '~routes';
import Numeral from '~shared/Numeral';
import { formatText } from '~utils/intl';
import { getBalanceForTokenAndDomain } from '~utils/tokens';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts';
import {
  TeamCardListItem,
  TeamCardListProps,
} from '~v5/common/TeamCardList/types';
import Link from '~v5/shared/Link';

import { getMembersList } from '../MembersPage/utils';

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
                icon: <Pencil size={16} />,
                label: formatText({ id: 'teamsPage.menu.editTeam' }),
                onClick: () =>
                  toggleActionSidebarOn({
                    [ACTION_TYPE_FIELD_NAME]: ACTION.EDIT_EXISTING_TEAM,
                    team: nativeId.toString(),
                  }),
              },
              {
                key: '2',
                icon: <Users size={16} />,
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
                icon: <PresentationChart size={16} />,
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
                icon: <ChartLine size={16} />,
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
              //   icon: <Handshake size={16} />,
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
                icon: <Layout size={16} />,
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
