import clsx from 'clsx';
import React, { useEffect, type FC } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import useTeamsOptions from '~hooks/useTeamsOptions.ts';
import TeamBadge from '~v5/common/Pills/TeamBadge/index.ts';
import SearchSelectPopover from '~v5/shared/SearchSelect/SearchSelectPopover.tsx';

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
  const { resetField } = useFormContext();
  const selectedTeam = field.value;
  const isError = !!error;
  const teamsOptions = useTeamsOptions(filterOptionsFn);
  const { formatMessage } = useIntl();

  const { getTooltipProps, setTooltipRef, setTriggerRef, triggerRef, visible } =
    usePopperTooltip({
      placement: 'bottom-start',
      trigger: ['click'],
      interactive: true,
      closeOnOutsideClick: true,
    });
  const selectedOption = teamsOptions.find(
    (option) => option.value === selectedTeam,
  );
  const { readonly } = useAdditionalFormOptionsContext();

  useEffect(() => {
    if (!selectedOption && field.value) {
      resetField(name);
    }
  }, [field.value, name, resetField, selectedOption]);

  return (
    <div className="w-full sm:relative">
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
            ref={setTriggerRef}
            className={clsx('flex text-md transition-colors', {
              'text-gray-400': !isError && !visible && !disabled,
              'text-gray-300': disabled,
              'text-negative-400': !disabled && isError,
              'text-blue-400': visible,
              'md:hover:text-blue-400': !disabled,
            })}
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
          {visible && (
            <SearchSelectPopover
              tooltipProps={getTooltipProps}
              setTooltipRef={setTooltipRef}
              triggerRef={triggerRef}
              items={[
                {
                  key: 'teams',
                  title: { id: 'actions.teams' },
                  isAccordion: false,
                  options: teamsOptions,
                },
              ]}
              onSelect={field.onChange}
            />
          )}
        </>
      )}
    </div>
  );
};

TeamsSelect.displayName = displayName;

export default TeamsSelect;
