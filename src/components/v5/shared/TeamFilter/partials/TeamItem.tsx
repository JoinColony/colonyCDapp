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
  hasDelimiter?: boolean;
  domain: Domain;
}

const TeamItem: FC<TeamItemProps> = ({
  domain,
  selected,
  hasDelimiter = true,
}) => {
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

  const label = domain.metadata?.name ?? domain.id;

  return (
    <button
      ref={teamItemRef}
      type="button"
      aria-label={label}
      className={clsx(
        'box-border inline-flex h-full w-full items-center justify-center border-y border-solid bg-base-white px-4 py-2 text-sm font-medium text-transparent bold-on-hover',
        selected ? teamColor : null,
        {
          'border-gray-200 hover:bg-gray-50': !selected,
          'border-l border-transparent after:font-semibold after:text-base-white hover:after:text-base-white':
            selected,
          'border-r': hasDelimiter,
        },
      )}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};

TeamItem.displayName = displayName;
export default TeamItem;
