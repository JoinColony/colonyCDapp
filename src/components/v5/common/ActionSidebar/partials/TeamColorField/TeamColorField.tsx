import clsx from 'clsx';
import React, { type FC } from 'react';
import { useController, useWatch } from 'react-hook-form';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import useColors from '~hooks/useColors.ts';
import { formatText } from '~utils/intl.ts';
import TeamColorBadge from '~v5/common/TeamColorBadge.tsx';
import MenuContainer from '~v5/shared/MenuContainer/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/PopoverBase.tsx';
import SearchItem from '~v5/shared/SearchSelect/partials/SearchItem/SearchItem.tsx';

import { type TeamColourFieldProps } from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.TeamColorField';

const TeamColorField: FC<TeamColourFieldProps> = ({ name, disabled }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });
  const isError = !!error;
  const colorsOptions = useColors();

  const { getTooltipProps, setTooltipRef, setTriggerRef, triggerRef, visible } =
    usePopperTooltip({
      placement: 'bottom-start',
      trigger: ['click'],
      interactive: true,
      closeOnOutsideClick: true,
    });

  const teamNameValue = useWatch({ name: 'teamName' });
  const { readonly } = useAdditionalFormOptionsContext();

  return (
    <div className="w-full sm:relative">
      {readonly ? (
        <TeamColorBadge defaultColor={field.value} title={teamNameValue} />
      ) : (
        <>
          <button
            ref={setTriggerRef}
            type="button"
            className={clsx('flex text-md transition-colors', {
              'text-gray-400': !isError && !visible && !disabled,
              'text-gray-300': disabled,
              'text-negative-400': isError,
              'text-blue-400': visible,
              'md:hover:text-blue-400': !disabled,
            })}
            disabled={disabled}
          >
            {field.value ? (
              <TeamColorBadge
                defaultColor={field.value}
                title={
                  teamNameValue || formatText({ id: 'actionSidebar.teamName' })
                }
              />
            ) : (
              formatText({ id: 'actionSidebar.selectTeamColor' })
            )}
          </button>
          {visible && (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              withTooltipStyles={false}
            >
              <MenuContainer
                className="w-full max-w-[calc(100%-2.25rem)] px-0 py-6 sm:w-auto sm:max-w-none sm:px-6"
                hasShadow
                rounded="s"
              >
                <SearchItem
                  options={colorsOptions?.options}
                  onChange={(value) => {
                    field.onChange(value);
                    triggerRef?.click();
                  }}
                  isLabelVisible={false}
                />
              </MenuContainer>
            </PopoverBase>
          )}
        </>
      )}
    </div>
  );
};

TeamColorField.displayName = displayName;

export default TeamColorField;
