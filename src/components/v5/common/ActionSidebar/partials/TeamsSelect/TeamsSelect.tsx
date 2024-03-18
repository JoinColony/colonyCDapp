import clsx from 'clsx';
import React, { type FC } from 'react';
import { useController } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useTeamsOptions from '~hooks/useTeamsOptions.ts';
import useToggle from '~hooks/useToggle/index.ts';
import TeamBadge from '~v5/common/Pills/TeamBadge/index.ts';
import SearchSelect from '~v5/shared/SearchSelect/index.ts';

import { type TeamSelectProps } from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.TeamsSelect';

const TeamsSelect: FC<TeamSelectProps> = ({
  name,
  readonly: readonlyProp,
  filterOptionsFn,
  disabled,
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
            className={clsx('flex text-md transition-colors', {
              'text-gray-400': (!isError && !isTeamSelectVisible) || disabled,
              'text-negative-400': !disabled && isError,
              'text-blue-400': isTeamSelectVisible,
              'md:hover:text-blue-400': !disabled,
            })}
            onClick={toggleTeamSelect}
            disabled={disabled}
          >
            {selectedOption && !disabled ? (
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
