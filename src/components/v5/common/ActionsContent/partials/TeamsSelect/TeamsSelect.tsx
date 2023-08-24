import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';

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

const TeamsSelect: FC<SelectProps> = ({ name, isErrors }) => {
  const { selectedAction } = useActionSidebarContext();
  const { setValue, register } = useFormContext();
  const teamsOptions = useTeams();
  const { formatMessage } = useIntl();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isTeamSelectVisible, { toggle: toggleTeamSelect }] = useToggle();

  useEffect(() => {
    if (
      selectedAction === Actions.TRANSFER_FUNDS ||
      selectedAction === Actions.UNLOCK_TOKEN ||
      selectedAction === Actions.CREATE_NEW_TEAM ||
      selectedAction === Actions.UPGRADE_COLONY_VERSION
    ) {
      setSelectedTeam('Root');
      setValue(name, Id.RootDomain);
    }
  }, [name, selectedAction, setValue]);

  return (
    <div className="sm:relative w-full">
      <button
        type="button"
        className={clsx(styles.button, {
          'text-gray-600': !isErrors,
          'text-negative-400': isErrors,
        })}
        onClick={toggleTeamSelect}
      >
        {selectedTeam ? (
          <TeamBadge teamName={selectedTeam} />
        ) : (
          formatMessage({ id: 'actionSidebar.selectTeam' })
        )}
      </button>
      <input
        type="text"
        {...register(name)}
        name={name}
        id={name}
        className="hidden"
        value={selectedTeam || ''}
      />
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
            setValue(name, teamId);
          }}
        />
      )}
    </div>
  );
};

TeamsSelect.displayName = displayName;

export default TeamsSelect;
