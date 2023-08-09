import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import { useFormContext } from 'react-hook-form';
import { useTeamsSelect } from './hooks';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect';
import useToggle from '~hooks/useToggle';
import TeamBadge from '~v5/common/Pills/TeamBadge';
import styles from '../../ActionsContent.module.css';
import { SelectProps } from '../../types';

const displayName = 'v5.common.ActionsContent.partials.TeamsSelect';

const TeamsSelect: FC<SelectProps> = ({ name }) => {
  const { register, setValue } = useFormContext();
  const teamsOptions = useTeamsSelect();
  const { formatMessage } = useIntl();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isTeamSelectVisible, { toggle: toggleTeamSelect }] = useToggle();

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={toggleTeamSelect}
      >
        {selectedTeam ? (
          <TeamBadge teamName={selectedTeam} text={selectedTeam} />
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
    </>
  );
};

TeamsSelect.displayName = displayName;

export default TeamsSelect;
