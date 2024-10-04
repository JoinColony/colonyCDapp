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
}

const AllTeamsItem: FC<AllTeamsItemProps> = ({ selected }) => {
  const { resetTeamFilter } = useColonyFiltersContext();

  const handleClick = () => {
    resetTeamFilter();
  };

  return (
    <button
      type="button"
      className={clsx(
        'border-r border-solid border-gray-200 px-4 py-2 text-sm',
        {
          'bg-base-white font-medium text-gray-700': !selected,
          'bg-gray-50 font-semibold text-gray-900': selected,
        },
      )}
      onClick={handleClick}
    >
      {formatText(MSG.allTeams)}
    </button>
  );
};

AllTeamsItem.displayName = displayName;
export default AllTeamsItem;
