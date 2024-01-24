import clsx from 'clsx';
import React, { FC } from 'react';
import { useController } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import useRelativePortalElement from '~hooks/useRelativePortalElement';
import useTeamsOptions from '~hooks/useTeamsOptions';
import useToggle from '~hooks/useToggle';
import TeamBadge from '~v5/common/Pills/TeamBadge';
import SearchSelect from '~v5/shared/SearchSelect';

import { TeamSelectProps } from './types';

const displayName = 'v5.common.ActionsContent.partials.TeamsSelect';

const TeamsSelect: FC<TeamSelectProps> = ({
  name,
  readonly: readonlyProp,
  filterOptionsFn,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });
  const selectedTeam = field.value;
  const isError = !!error;
  const teamsOptions = useTeamsOptions(filterOptionsFn);
  const { formatMessage } = useIntl();
  const [
    isTeamSelectVisible,
    {
      toggle: toggleTeamSelect,
      toggleOff: toggleTeamSelectOff,
      registerContainerRef,
    },
  ] = useToggle();
  const selectedOption = teamsOptions.find(
    (option) => option.value === selectedTeam,
  );
  const { readonly } = useAdditionalFormOptionsContext();

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTeamSelectVisible]);

  return (
    <div className="sm:relative w-full">
      {readonly || readonlyProp ? (
        <TeamBadge
          name={
            typeof selectedOption?.label === 'object'
              ? formatMessage(selectedOption?.label)
              : selectedOption?.label || ''
          }
          color={selectedOption?.color}
        />
      ) : (
        <>
          <button
            type="button"
            ref={relativeElementRef}
            className={clsx(
              'flex text-md transition-colors md:hover:text-blue-400',
              {
                'text-gray-400': !isError && !isTeamSelectVisible,
                'text-negative-400': isError,
                'text-blue-400': isTeamSelectVisible,
              },
            )}
            onClick={toggleTeamSelect}
          >
            {selectedOption ? (
              <TeamBadge
                name={
                  typeof selectedOption.label === 'object'
                    ? formatMessage(selectedOption.label)
                    : selectedOption.label
                }
                color={selectedOption.color}
              />
            ) : (
              formatMessage({ id: 'actionSidebar.selectTeam' })
            )}
          </button>
          {isTeamSelectVisible && (
            <SearchSelect
              ref={(ref) => {
                registerContainerRef(ref);
                portalElementRef.current = ref;
              }}
              items={[
                {
                  key: 'teams',
                  title: { id: 'actions.teams' },
                  isAccordion: false,
                  options: teamsOptions,
                },
              ]}
              onSelect={(value) => {
                field.onChange(value);

                toggleTeamSelectOff();
              }}
              className="z-[60]"
            />
          )}
        </>
      )}
    </div>
  );
};

TeamsSelect.displayName = displayName;

export default TeamsSelect;
