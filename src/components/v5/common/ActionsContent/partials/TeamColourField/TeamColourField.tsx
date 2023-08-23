import React, { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';

import clsx from 'clsx';
import styles from '../../ActionsContent.module.css';
import useToggle from '~hooks/useToggle';
import Card from '~v5/shared/Card';
import { useDetectClickOutside } from '~hooks';
import { useTeams } from '~hooks/useTeams';
import SearchItem from '~v5/shared/SearchSelect/partials/SearchItem/SearchItem';
import TeamColourBadge from './partails/TeamColourBadge';

const displayName = 'v5.common.ActionsContent.partials.TeamColourField';

const TeamColourField: FC = () => {
  const method = useFormContext();
  const { formatMessage } = useIntl();
  const methods = useFormContext();
  const teamsOptions = useTeams();
  const [selectedTeamColour, setSelectedTeamColour] = useState<string>();
  const [
    isTeamColourSelectVisible,
    { toggle: toggleDecisionSelect, toggleOff: toggleOffDecisionSelect },
  ] = useToggle();

  const ref = useDetectClickOutside({
    onTriggered: () => toggleOffDecisionSelect(),
  });

  return (
    <div className="sm:relative w-full" ref={ref}>
      <button
        type="button"
        className={clsx(styles.button)}
        onClick={toggleDecisionSelect}
      >
        {selectedTeamColour ? (
          <TeamColourBadge title={selectedTeamColour} />
        ) : (
          formatMessage({ id: 'actionSidebar.selectTeam' })
        )}
      </button>
      <input
        type="text"
        {...method?.register('domainColor')}
        name="domainColor"
        id="domainColor"
        className="hidden"
        value={selectedTeamColour || ''}
      />
      {isTeamColourSelectVisible && (
        <Card
          className="p-6 max-w-[14.5rem] sm:max-w-[10.875rem] absolute top-[calc(100%+0.5rem)] left-0 z-50"
          hasShadow
          rounded="s"
        >
          <ul>
            <SearchItem
              options={teamsOptions?.options}
              onChange={(value) => {
                const teamId = teamsOptions.options.find(
                  (team) => team.value === value,
                )?.nativeId;

                setSelectedTeamColour(value);
                methods?.setValue('domainColor', teamId);
              }}
              isLableVisible={false}
            />
          </ul>
        </Card>
      )}
    </div>
  );
};

TeamColourField.displayName = displayName;

export default TeamColourField;
