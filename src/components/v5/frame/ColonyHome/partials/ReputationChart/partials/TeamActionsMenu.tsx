import { Eye, LockKey, Pencil } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useColonyFiltersContext } from '~context/GlobalFiltersContext/ColonyFiltersContext.ts';
import useDropdown from '~hooks/useDropdown.ts';
import { COLONY_TEAMS_ROUTE } from '~routes/routeConstants.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import { DropdownItem } from '~v5/shared/Dropdown/DropdownItem.tsx';
import DropdownMenu from '~v5/shared/Dropdown/DropdownMenu.tsx';

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

interface TeamActionsMenuProps {
  isDisabled?: boolean;
}

const TeamActionsMenu: FC<TeamActionsMenuProps> = ({ isDisabled }) => {
  const {
    colony: { name: colonyName },
  } = useColonyContext();

  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const { resetTeamFilter } = useColonyFiltersContext();
  const navigate = useNavigate();

  const {
    setIsDropdownOpen,
    setTriggerRef,
    setTooltipRef,
    getTooltipProps,
    visible,
  } = useDropdown();

  const handleViewAllTeamsClick = () => {
    resetTeamFilter();
    navigate(`/${colonyName}/${COLONY_TEAMS_ROUTE}`);
  };

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
    <DropdownMenu
      isDisabled={isDisabled}
      visible={visible}
      setTriggerRef={setTriggerRef}
      setTooltipRef={setTooltipRef}
      getTooltipProps={getTooltipProps}
    >
      <>
        <DropdownItem
          icon={Eye}
          label={formatText(MSG.viewAllTeams)}
          onClick={handleViewAllTeamsClick}
        />
        <DropdownItem
          icon={LockKey}
          label={formatText(MSG.createTeam)}
          onClick={handleCreateTeamClick}
        />
        <DropdownItem
          icon={Pencil}
          label={formatText(MSG.editTeam)}
          onClick={handleEditTeamClick}
        />
      </>
    </DropdownMenu>
  );
};

TeamActionsMenu.displayName = displayName;
export default TeamActionsMenu;
