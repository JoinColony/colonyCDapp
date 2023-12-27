import { useMemo } from 'react';

import { TEAM_SEARCH_PARAM } from '~routes';
import { notMaybe } from '~utils/arrays';
import { formatText } from '~utils/intl';
import { getTeamColor } from '~utils/teams';
import { setQueryParamOnUrl } from '~utils/urls';

import useColonyContext from './useColonyContext';
import useGetSelectedDomainFilter from './useGetSelectedDomainFilter';

export const useCreateTeamBreadcrumbs = () => {
  const { colony } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const { domains } = colony || {};
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
