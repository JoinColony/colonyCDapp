import clsx from 'clsx';
import React, { useEffect, type FC } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useColonyFiltersContext } from '~context/GlobalFiltersContext/ColonyFiltersContext.ts';
import { useMobile } from '~hooks/index.ts';
import { useScrollIntoView } from '~hooks/useScrollIntoView.ts';
import { TEAM_SEARCH_PARAM } from '~routes/index.ts';
import { type Domain } from '~types/graphql.ts';
import { getTeamColor } from '~utils/teams.ts';

const displayName = 'v5.shared.TeamFilter.partials.TeamItem';

interface TeamItemProps {
  selected: boolean;
  domain: Domain;
}

const TeamItem: FC<TeamItemProps> = ({ domain, selected }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { ref: teamItemRef, scroll } = useScrollIntoView<HTMLButtonElement>();
  const isMobile = useMobile();
  const { setFilteredTeam } = useColonyFiltersContext();

  const teamColor = getTeamColor(domain.metadata?.color);

  useEffect(() => {
    if (selected && isMobile) {
      scroll({
        block: 'end',
        inline: 'center',
        behavior: 'smooth',
      });
    }
  }, [selected, isMobile, scroll]);

  const handleClick = () => {
    if (selected) {
      searchParams.delete(TEAM_SEARCH_PARAM);
      setFilteredTeam(null);
      setSearchParams(searchParams);
    } else {
      const domainNativeId = domain.nativeId.toString();

      searchParams.set(TEAM_SEARCH_PARAM, domainNativeId);
      setFilteredTeam(domainNativeId);
      setSearchParams(searchParams);
    }
  };

  return (
    <button
      ref={teamItemRef}
      type="button"
      className={clsx(
        'w-full bg-base-white px-4 py-2 text-sm',
        selected ? teamColor : null,
        {
          'border-r border-solid border-gray-200 font-medium text-gray-700':
            !selected,
          'border-0 font-semibold text-base-white': selected,
        },
      )}
      onClick={handleClick}
    >
      {domain.metadata?.name ?? domain.id}
    </button>
  );
};

TeamItem.displayName = displayName;
export default TeamItem;
