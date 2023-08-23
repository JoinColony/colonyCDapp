import React, { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';

import clsx from 'clsx';
import styles from '../../ActionsContent.module.css';
import useToggle from '~hooks/useToggle';
import Card from '~v5/shared/Card';
import { useDetectClickOutside } from '~hooks';
import { decisionMethodOptions } from './consts';

const displayName = 'v5.common.ActionsContent.partials.TeamColourField';

const TeamColourField: FC = () => {
  const method = useFormContext();
  const { formatMessage } = useIntl();
  const [selectedTeamColour, setSelectedTeamColour] = useState<string | null>(
    'reputation',
  );
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
        className={clsx(styles.button, 'capitalize')}
        onClick={toggleDecisionSelect}
      >
        {selectedTeamColour}
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
          className="p-6 w-full sm:max-w-[13rem] absolute top-[calc(100%+0.5rem)] left-0 z-50"
          hasShadow
          rounded="s"
        >
          <h5 className="text-4 text-gray-400 mb-4 uppercase">
            {formatMessage({ id: 'actionSidebar.availableDecisions' })}
          </h5>
          <ul>
            {decisionMethodOptions.map(({ key, label, value }) => (
              <li key={key} className="mb-4 last:mb-0">
                <button
                  type="button"
                  className={styles.button}
                  aria-label={formatMessage({
                    id: 'ariaLabel.selectTeamColour',
                  })}
                  onClick={() => {
                    setSelectedTeamColour(value);
                    method?.setValue('domainColor', value);
                  }}
                >
                  {formatMessage(label)}
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

TeamColourField.displayName = displayName;

export default TeamColourField;
