import React, { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';

import clsx from 'clsx';
import styles from '../../ActionsContent.module.css';
import useToggle from '~hooks/useToggle';
import Card from '~v5/shared/Card';
import { useDetectClickOutside } from '~hooks';
import { decisionMethodOptions } from './consts';
import { DecisionFieldProps } from './types';

const displayName = 'v5.common.ActionsContent.partials.DecisionField';

const DecisionField: FC<DecisionFieldProps> = ({ isErrors }) => {
  const method = useFormContext();
  const { formatMessage } = useIntl();
  const [selectedDecisionMethod, setSelectedDecisionMethod] = useState<
    string | null
  >('reputation');
  const [
    isDecisionSelectVisible,
    { toggle: toggleDecisionSelect, toggleOff: toggleOffDecisionSelect },
  ] = useToggle();

  const ref = useDetectClickOutside({
    onTriggered: () => toggleOffDecisionSelect(),
  });

  return (
    <div className="sm:relative w-full" ref={ref}>
      <button
        type="button"
        className={clsx(styles.button, 'capitalize', {
          'text-negative-400': isErrors,
        })}
        onClick={toggleDecisionSelect}
      >
        {selectedDecisionMethod}
      </button>
      <input
        type="text"
        {...method?.register('decisionMethod')}
        name="decisionMethod"
        id="decisionMethod"
        className="hidden"
        value={selectedDecisionMethod || ''}
      />
      {isDecisionSelectVisible && (
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
                    id: 'ariaLabel.selectDecisionMethod',
                  })}
                  onClick={() => {
                    setSelectedDecisionMethod(value);
                    method?.setValue('decisionMethod', value);
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

DecisionField.displayName = displayName;

export default DecisionField;
