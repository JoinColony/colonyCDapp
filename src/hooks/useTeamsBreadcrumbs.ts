import { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { TEAM_SEARCH_PARAM } from '~routes/index.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { getTeamColor } from '~utils/teams.ts';
import { setQueryParamOnUrl } from '~utils/urls.ts';

import useGetSelectedDomainFilter from './useGetSelectedDomainFilter.tsx';

export const useCreateTeamBreadcrumbs = () => {
  const {
    colony: { domains },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const navigationPathname = window.location.pathname;

  const activeItem = selectedDomain
    ? setQueryParamOnUrl(
        navigationPathname,
        TEAM_SEARCH_PARAM,
        `${selectedDomain.nativeId}`,
      )
    : navigationPathname;

  const teamOptions = useMemo(
    () =>
      domains?.items.filter(notMaybe).map((domain) => {
        const color = getTeamColor(domain.metadata?.color);

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
