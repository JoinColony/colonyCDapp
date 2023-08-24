import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useController } from 'react-hook-form';

import { Id } from '@colony/colony-js';
import SearchSelect from '~v5/shared/SearchSelect';
import useToggle from '~hooks/useToggle';
import TeamBadge from '~v5/common/Pills/TeamBadge';
import styles from '../../ActionsContent.module.css';
import { SelectProps } from '../../types';
import { useTeams } from '~hooks/useTeams';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { Actions } from '~constants/actions';

const displayName = 'v5.common.ActionsContent.partials.TeamsSelect';

const TeamsSelect: FC<SelectProps> = ({ name }) => {
  const { selectedAction } = useActionSidebarContext();
  const isRootDomain =
    selectedAction === Actions.TRANSFER_FUNDS ||
    selectedAction === Actions.UNLOCK_TOKEN ||
    selectedAction === Actions.CREATE_NEW_TEAM ||
    selectedAction === Actions.UPGRADE_COLONY_VERSION;

  const { field } = useController({
    name,
    defaultValue: isRootDomain && Id.RootDomain,
  });
  const teamsOptions = useTeams();
  const { formatMessage } = useIntl();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isTeamSelectVisible, { toggle: toggleTeamSelect }] = useToggle();

  useEffect(() => {
    if (isRootDomain) {
      setSelectedTeam('Root');
    }
  }, [isRootDomain, selectedAction]);

  return (
    <div className="sm:relative w-full">
      <button
        type="button"
        className={styles.button}
        onClick={toggleTeamSelect}
      >
        {selectedTeam ? (
          <TeamBadge teamName={selectedTeam} />
        ) : (
          formatMessage({ id: 'actionSidebar.selectTeam' })
        )}
      </button>
      <input type="text" id={name} className="hidden" {...field} />
      {isTeamSelectVisible && (
        <SearchSelect
          items={[teamsOptions]}
          isOpen={isTeamSelectVisible}
          onToggle={toggleTeamSelect}
          onSelect={(value) => {
            const teamId = teamsOptions.options.find(
              (team) => team.value === value,
            )?.nativeId;

            setSelectedTeam(value);
            field.onChange(teamId);
          }}
        />
      )}
    </div>
  );
};

TeamsSelect.displayName = displayName;

export default TeamsSelect;
