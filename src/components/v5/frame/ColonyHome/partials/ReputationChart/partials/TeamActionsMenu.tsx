import { DotsThreeVertical, Eye, LockKey, Pencil } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { defineMessages } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';
import { Link } from 'react-router-dom';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { tw } from '~utils/css/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';

const displayName =
  'v5.frame.ColonyHome.ReputationChart.partials.TeamActionsMenu';

const MSG = defineMessages({
  viewAllTeams: {
    id: `${displayName}.viewAllTeams`,
    defaultMessage: 'View all teams',
  },
  createTeam: {
    id: `${displayName}.createTeam`,
    defaultMessage: 'Create new team',
  },
  editTeam: {
    id: `${displayName}.editTeam`,
    defaultMessage: 'Edit team',
  },
});

// @TODO maybe decouple some of this into a dropdown menu component?
// eslint-disable-next-line max-len
const dropdownItemClassName = tw`flex w-full items-center gap-2 rounded-s px-3 py-2 text-md text-gray-900 hover:font-medium md:hover:bg-gray-50`;

const TeamActionsMenu = () => {
  const {
    colony: { name: colonyName },
  } = useColonyContext();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      placement: 'bottom-end',
      trigger: ['click'],
      visible: isDropdownOpen,
      onVisibleChange: setIsDropdownOpen,
      interactive: true,
      closeOnOutsideClick: true,
      offset: [0, 0],
    });

  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const handleCreateTeamClick = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: Action.CreateNewTeam,
    });
    setIsDropdownOpen(false);
  };

  const handleEditTeamClick = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: Action.EditExistingTeam,
    });
    setIsDropdownOpen(false);
  };

  return (
    <>
      <button
        type="button"
        ref={setTriggerRef}
        className={clsx('hover:text-blue-400', {
          'text-gray-400': !visible,
          'text-blue-400': visible,
        })}
      >
        <DotsThreeVertical size={18} />
      </button>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps()}
          className="z-dropdown w-full px-6 sm:w-auto sm:px-0"
        >
          <div className="flex w-full flex-col rounded-lg border border-gray-200 bg-base-white px-3 py-4 shadow-default sm:w-[14.25rem]">
            <Link to={`/${colonyName}/teams`} className={dropdownItemClassName}>
              <Eye size={18} />
              <span>{formatText(MSG.viewAllTeams)}</span>
            </Link>
            <button
              type="button"
              className={dropdownItemClassName}
              onClick={handleCreateTeamClick}
            >
              <LockKey size={18} />
              <span>{formatText(MSG.createTeam)}</span>
            </button>
            <button
              type="button"
              className={dropdownItemClassName}
              onClick={handleEditTeamClick}
            >
              <Pencil size={18} />
              <span>{formatText(MSG.editTeam)}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

TeamActionsMenu.displayName = displayName;
export default TeamActionsMenu;
