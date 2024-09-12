import clsx from 'clsx';
import React, { type FC } from 'react';
import { useSearchParams } from 'react-router-dom';

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

  const teamColor = getTeamColor(domain.metadata?.color);

  const handleClick = () => {
    if (selected) {
      searchParams.delete(TEAM_SEARCH_PARAM);
      setSearchParams(searchParams);
    } else {
      searchParams.set(TEAM_SEARCH_PARAM, domain.nativeId.toString());
      setSearchParams(searchParams);
    }
  };

  return (
    <button
      type="button"
      className={clsx(
        'w-full bg-base-white px-4 py-2 text-3',
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
