import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { TEAM_SEARCH_PARAM } from '~routes';
import { notMaybe } from '~utils/arrays';
import { formatText } from '~utils/intl';
import { setQueryParamOnUrl } from '~utils/urls';
import { setTeamColor } from '~v5/common/TeamReputationSummary/utils';

import useColonyContext from './useColonyContext';

export const useGetSelectedTeamFilter = () => {
  const { colony } = useColonyContext();
  const { domains } = colony || {};

  const [searchParams, setSearchParams] = useSearchParams();
  const team = searchParams.get(TEAM_SEARCH_PARAM);

  const teamId = useMemo(
    () =>
      domains?.items.find(
        (domain) => domain?.nativeId === parseFloat(team || '0'),
      ),
    [domains?.items, team],
  );

  useEffect(() => {
    if (team && !teamId) {
      searchParams.delete(TEAM_SEARCH_PARAM);
      setSearchParams(searchParams);
    }
  }, [searchParams, team, setSearchParams, teamId]);

  return teamId;
};

export const useCreateTeamBreadcrumbs = () => {
  const { colony } = useColonyContext();
  const selectedValue = useGetSelectedTeamFilter();
  const { domains } = colony || {};
  const navigationPathname = window.location.pathname;

  const activeItem = selectedValue
    ? setQueryParamOnUrl(
        navigationPathname,
        TEAM_SEARCH_PARAM,
        `${selectedValue.nativeId}`,
      )
    : navigationPathname;

  const teamOptions = useMemo(
    () =>
      domains?.items.filter(notMaybe).map((domain) => {
        const color = setTeamColor(domain.metadata?.color);

        return {
          label: domain.metadata?.name,
          color,
          href: setQueryParamOnUrl(
            navigationPathname,
            TEAM_SEARCH_PARAM,
            `${domain.nativeId}`,
          ),
        };
      }) || [],
    [domains?.items, navigationPathname],
  );

  return useMemo(
    () => [
      {
        key: 'teams',
        dropdownOptions: [
          {
            label: formatText({ id: 'breadcrumbs.allTeams' }),
            color: 'bg-gray-900',
            href: window.location.pathname,
          },
          ...teamOptions,
        ],
        selectedValue: activeItem,
      },
    ],
    [teamOptions, activeItem],
  );
};
