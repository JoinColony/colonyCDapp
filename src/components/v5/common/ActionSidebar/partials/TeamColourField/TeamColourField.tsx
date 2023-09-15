import React, { FC } from 'react';
import { useController, useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';

import clsx from 'clsx';
import useToggle from '~hooks/useToggle';
import Card from '~v5/shared/Card';
import SearchItem from '~v5/shared/SearchSelect/partials/SearchItem/SearchItem';
import TeamColourBadge from './partials/TeamColourBadge';
import { TeamColourFieldProps } from './types';
import { useColors } from '~hooks/useColors';

const displayName = 'v5.common.ActionsContent.partials.TeamColourField';

const TeamColourField: FC<TeamColourFieldProps> = ({ name }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });
  const isError = !!error;
  const { formatMessage } = useIntl();
  const colorsOptions = useColors();
  const [
    isTeamColourSelectVisible,
    {
      toggle: toggleDecisionSelect,
      toggleOff: toggleOffDecisionSelect,
      registerContainerRef,
    },
  ] = useToggle();
  const teamNameValue = useWatch({ name: 'teamName' });

  return (
    <div className="sm:relative w-full" ref={registerContainerRef}>
      <button
        type="button"
        className={clsx('flex text-md transition-colors hover:text-blue-400', {
          'placeholder-gray-500': !isError,
          'placeholder-negative-400': isError,
        })}
        onClick={toggleDecisionSelect}
      >
        {field.value ? (
          <TeamColourBadge
            defaultColor={field.value}
            title={teamNameValue || ''}
          />
        ) : (
          formatMessage({ id: 'actionSidebar.selectTeam' })
        )}
      </button>
      {isTeamColourSelectVisible && (
        <Card
          className="p-6 max-w-[14.5rem] sm:max-w-[10.875rem] absolute top-[calc(100%+0.5rem)] left-0 z-50"
          hasShadow
          rounded="s"
        >
          <SearchItem
            options={colorsOptions?.options}
            onChange={(value) => {
              field.onChange(value);
              toggleOffDecisionSelect();
            }}
            isLabelVisible={false}
          />
        </Card>
      )}
    </div>
  );
};

TeamColourField.displayName = displayName;

export default TeamColourField;
