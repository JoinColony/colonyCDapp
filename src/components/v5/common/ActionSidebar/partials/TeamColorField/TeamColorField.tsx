import clsx from 'clsx';
import React, { type FC } from 'react';
import { useController, useWatch } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import useColors from '~hooks/useColors.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import TeamColorBadge from '~v5/common/TeamColorBadge.tsx';
import MenuContainer from '~v5/shared/MenuContainer/index.ts';
import Portal from '~v5/shared/Portal/index.ts';
import { TeamOptionRenderer } from '~v5/shared/SearchSelect/partials/OptionRenderer/TeamOptionRenderer.tsx';
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
  const [
    isTeamColourSelectVisible,
    {
      toggle: toggleDecisionSelect,
      toggleOff: toggleOffDecisionSelect,
      registerContainerRef,
    },
  ] = useToggle();
  const teamNameValue = useWatch({ name: 'teamName' });
  const { readonly } = useAdditionalFormOptionsContext();

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTeamColourSelectVisible], {
    top: 8,
    withAutoTopPlacement: true,
  });

  return (
    <div className="w-full sm:relative">
      {readonly ? (
        <TeamColorBadge defaultColor={field.value} title={teamNameValue} />
      ) : (
        <>
          <button
            ref={relativeElementRef}
            type="button"
            className={clsx('flex text-md transition-colors', {
              'text-gray-400':
                !isError && !isTeamColourSelectVisible && !disabled,
              'text-gray-300': disabled,
              'text-negative-400': isError,
              'text-blue-400': isTeamColourSelectVisible,
              'md:hover:text-blue-400': !disabled,
            })}
            onClick={toggleDecisionSelect}
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
          {isTeamColourSelectVisible && (
            <Portal>
              <MenuContainer
                ref={(ref) => {
                  registerContainerRef(ref);
                  portalElementRef.current = ref;
                }}
                className="absolute z-sidebar w-full max-w-[calc(100%-2.25rem)] px-0 py-6 sm:w-auto sm:max-w-none sm:px-6"
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
                  renderOption={TeamOptionRenderer}
                />
              </MenuContainer>
            </Portal>
          )}
        </>
      )}
    </div>
  );
};

TeamColorField.displayName = displayName;

export default TeamColorField;
