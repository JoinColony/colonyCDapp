import clsx from 'clsx';
import React, { useEffect, type FC } from 'react';

import { useColonyFiltersContext } from '~context/GlobalFiltersContext/ColonyFiltersContext.ts';
import { useMobile } from '~hooks/index.ts';
import { useScrollIntoView } from '~hooks/useScrollIntoView.ts';
import { type Domain } from '~types/graphql.ts';
import { getTeamColor } from '~utils/teams.ts';

const displayName = 'v5.shared.TeamFilter.partials.TeamItem';

interface TeamItemProps {
  selected: boolean;
  domain: Domain;
}

const TeamItem: FC<TeamItemProps> = ({ domain, selected }) => {
  const { ref: teamItemRef, scroll } = useScrollIntoView<HTMLButtonElement>();
  const isMobile = useMobile();
  const { updateTeamFilter, resetTeamFilter } = useColonyFiltersContext();

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
      resetTeamFilter();
    } else {
      const domainNativeId = domain.nativeId.toString();
      updateTeamFilter(domainNativeId);
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
