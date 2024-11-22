import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useColonyFiltersContext } from '~context/GlobalFiltersContext/ColonyFiltersContext.ts';
import { formatText } from '~utils/intl.ts';

const displayName = 'v5.shared.TeamFilter.partials.AllTeamsItem';

const MSG = defineMessages({
  allTeams: {
    id: `${displayName}.allTeams`,
    defaultMessage: 'All teams',
  },
});

interface AllTeamsItemProps {
  selected: boolean;
  hasDelimiter?: boolean;
}

const AllTeamsItem: FC<AllTeamsItemProps> = ({
  selected,
  hasDelimiter = true,
}) => {
  const { resetTeamFilter } = useColonyFiltersContext();

  const handleClick = () => {
    resetTeamFilter();
  };

  const label = formatText(MSG.allTeams);

  return (
    <button
      type="button"
      aria-label={label}
      className={clsx(
        'inline-flex items-center rounded-l-lg border-y border-l border-solid border-gray-200 px-4 py-2 text-sm text-transparent outline-offset-[-1px] bold-on-hover',
        {
          'bg-base-white hover:bg-gray-50': !selected,
          'bg-gray-50 after:font-semibold after:text-gray-900': selected,
          'border-r': hasDelimiter,
        },
      )}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};

AllTeamsItem.displayName = displayName;
export default AllTeamsItem;
