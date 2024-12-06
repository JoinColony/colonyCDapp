import {
  ChartLine,
  // @todo: uncomment when decisions page will be ready
  // Handshake,
  Layout,
  Star,
  Pencil,
  PresentationChart,
  Users,
  Cardholder,
} from '@phosphor-icons/react';
import React, { useCallback, useState } from 'react';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { DomainColor, ModelSortDirection } from '~gql';
import { useMobile } from '~hooks';
import { useActivityData } from '~hooks/useActivityData.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_BALANCES_ROUTE,
  COLONY_MEMBERS_ROUTE,
  // @todo: uncomment when decisions page will be ready
  // COLONY_DECISIONS_ROUTE,
  TEAM_SEARCH_PARAM,
} from '~routes/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { convertToDecimal } from '~utils/convertToDecimal.ts';
import { getDomainNameFallback } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
import { getBalanceForTokenAndDomain } from '~utils/tokens.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import { type TeamCardListItem } from '~v5/common/TeamCardList/types.ts';
import Link from '~v5/shared/Link/index.ts';

import { getMembersList } from '../MembersPage/utils.ts';

import { type TeamsPageFilterProps } from './partials/TeamsPageFilter/types.ts';
import { TeamsPageFiltersField, type TeamsPageFilters } from './types.ts';

export const useTeams = () => {
  const isMobile = useMobile();
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

        const { user, role, reputation } = item;

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

      if (selectedDomain && selectedDomain.nativeId !== nativeId) {
        return result;
      }

      const { color, description, name } = metadata || {
        color: DomainColor.Root,
        description: '',
        name: getDomainNameFallback({ nativeId }),
      };

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
          balanceValue: convertToDecimal(
            getBalanceForTokenAndDomain(
              balances,
              nativeToken?.tokenAddress || '',
              nativeId,
            ) || 0,
            nativeToken?.decimals || 0,
          )?.toNumber(),
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
                    [ACTION_TYPE_FIELD_NAME]: Action.EditExistingTeam,
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
                      pathname: `/${colonyName}/${COLONY_MEMBERS_ROUTE}`,
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
          searchParams: {
            team: `?${TEAM_SEARCH_PARAM}=${nativeId}`,
          },
        },
      ];
    }, []) || [];

  const [searchValue, setSearchValue] = useState('');

  const defaultFilterValue: TeamsPageFilters = {
    field: TeamsPageFiltersField.REPUTATION,
    direction: ModelSortDirection.Desc,
  };
  const [hasFilterChanged, setHasFilterChanged] = useState(false);
  const [filterValue, setFilterValue] =
    useState<TeamsPageFilters>(defaultFilterValue);

  const sortedTeams = [...teams].sort((a, b) => {
    // If values match, sort alphabetically
    if (a[filterValue.field] === b[filterValue.field]) {
      const nameA = a.title || '';
      const nameB = b.title || '';

      return nameA.localeCompare(nameB);
    }

    if (filterValue.direction === ModelSortDirection.Asc) {
      return a[filterValue.field] - b[filterValue.field];
    }

    return b[filterValue.field] - a[filterValue.field];
  });
  const searchedTeams = sortedTeams.filter(
    ({ title, description }) =>
      title?.toLowerCase().includes(searchValue.toLowerCase()) ||
      description?.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const filters: TeamsPageFilterProps = {
    onChange: (value) => {
      setFilterValue(value);
      const { field, direction } = value as TeamsPageFilters;
      if (field !== filterValue.field || direction !== filterValue.direction) {
        setHasFilterChanged(true);
      }
    },
    onSearch: setSearchValue,
    searchValue,
    hasFilterChanged,
    filterValue,
    items: [
      {
        name: TeamsPageFiltersField.FUNDS,
        filterName: 'Funds',
        label: formatText({ id: 'teamsPage.filter.funds' }),
        icon: Cardholder,
        title: formatText({
          id: isMobile
            ? 'teamsPage.filter.sortByFunds'
            : 'teamsPage.filter.funds',
        }),
        items: [
          {
            label: formatText({ id: 'teamsPage.filter.descending' }),
            value: ModelSortDirection.Desc,
          },
          {
            label: formatText({ id: 'teamsPage.filter.ascending' }),
            value: ModelSortDirection.Asc,
          },
        ],
      },
      {
        name: TeamsPageFiltersField.REPUTATION,
        filterName: 'Reputation',
        label: formatText({ id: 'teamsPage.filter.reputation' }),
        title: formatText({
          id: isMobile
            ? 'teamsPage.filter.sortbyReputation'
            : 'teamsPage.filter.reputation',
        }),
        icon: Star,
        items: [
          {
            label: formatText({ id: 'teamsPage.filter.descending' }),
            value: ModelSortDirection.Desc,
          },
          {
            label: formatText({ id: 'teamsPage.filter.ascending' }),
            value: ModelSortDirection.Asc,
          },
        ],
      },
    ],
  };

  return {
    searchedTeams,
    defaultFilterValue,
    filters,
    hasFilterChanged,
  };
};
