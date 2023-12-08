import React, { FC } from 'react';
import { useController, useWatch } from 'react-hook-form';
import clsx from 'clsx';

import { useColors, useRelativePortalElement, useToggle } from '~hooks';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import { formatText } from '~utils/intl';
import MenuContainer from '~v5/shared/MenuContainer';
import Portal from '~v5/shared/Portal';
import SearchItem from '~v5/shared/SearchSelect/partials/SearchItem/SearchItem';

import TeamColourBadge from './partials/TeamColourBadge';
import { TeamColourFieldProps } from './types';

const displayName = 'v5.common.ActionsContent.partials.TeamColourField';

const TeamColourField: FC<TeamColourFieldProps> = ({ name }) => {
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
  const { readonly, isActionPending } = useAdditionalFormOptionsContext();

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTeamColourSelectVisible], {
    top: 8,
  });

  return (
    <div className="sm:relative w-full">
      {readonly || isActionPending ? (
        <TeamColourBadge defaultColor={field.value} title={teamNameValue} />
      ) : (
        <>
          <button
            ref={relativeElementRef}
            type="button"
            className={clsx(
              'flex text-md transition-colors md:hover:text-blue-400',
              {
                'text-gray-400': !isError && !isTeamColourSelectVisible,
                'text-negative-400': isError,
                'text-blue-400': isTeamColourSelectVisible,
              },
            )}
            onClick={toggleDecisionSelect}
          >
            {field.value ? (
              <TeamColourBadge
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
                className="p-6 absolute z-[60] w-full max-w-[calc(100%-2.25rem)] sm:w-auto sm:max-w-none"
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
              </MenuContainer>
            </Portal>
          )}
        </>
      )}
    </div>
  );
};

TeamColourField.displayName = displayName;

export default TeamColourField;
