import { CaretUpDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { defineMessages } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import { formatText } from '~utils/intl.ts';
import { capitalizeFirstLetter } from '~utils/strings.ts';
import Button from '~v5/shared/Button/index.ts';

import { sidebarButtonClass } from '../Sidebar/sidebar.styles.ts';

import { ColonySwitcherAvatar } from './partials/ColonySwitcherAvatar.tsx';
import JoinedColoniesPopover from './partials/JoinedColoniesPopover/JoinedColoniesPopover.tsx';
import { type ColonySwitcherProps } from './types.ts';

const displayName = 'v5.common.Navigation.ColonySwitcher';

const MSG = defineMessages({
  selectColony: {
    id: `${displayName}.selectColony`,
    defaultMessage: 'Select colony',
  },
});

const ColonySwitcher: React.FC<ColonySwitcherProps> = ({
  isLogoButton,
  offset,
  className,
  enableMobileAndDesktopLayoutBreakpoints,
  showColonySwitcherText = false,
}) => {
  const colonyContext = useColonyContext({ nullableContext: true });

  const { isDarkMode } = usePageThemeContext();

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      placement: 'right-start',
      trigger: 'click',
      interactive: true,
      offset: offset ?? [-31, 16],
    });

  const colonyName =
    colonyContext?.colony.metadata?.displayName ?? colonyContext?.colony.name;

  return (
    <>
      <Button
        ref={setTriggerRef}
        type="button"
        className={clsx(sidebarButtonClass, className, 'group !py-[4.5px]', {
          '!justify-center': isLogoButton,
          '!justify-between': !isLogoButton,
          '!bg-gray-100 hover:!bg-gray-50': isDarkMode,
          '!bg-gray-50': isDarkMode && visible,
          '!bg-gray-800': !isDarkMode && visible,
          '!p-2 hover:!bg-gray-800':
            enableMobileAndDesktopLayoutBreakpoints && !isDarkMode,
          '!p-2 hover:!bg-gray-50':
            enableMobileAndDesktopLayoutBreakpoints && isDarkMode,
        })}
      >
        <section className="flex flex-row items-center gap-3 overflow-hidden">
          <ColonySwitcherAvatar
            enableMobileAndDesktopLayoutBreakpoints={
              enableMobileAndDesktopLayoutBreakpoints
            }
          />
          {showColonySwitcherText && (
            <p
              className={clsx(
                'truncate text-md font-semibold text-base-white',
                {
                  '!text-gray-900': isDarkMode,
                },
              )}
            >
              {colonyName
                ? capitalizeFirstLetter(colonyName)
                : formatText(MSG.selectColony)}
            </p>
          )}
        </section>
        {!isLogoButton && (
          <section>
            <CaretUpDown
              size={12}
              className={clsx(
                'w-auto flex-shrink-0 text-gray-400 transition-colors group-hover:text-base-white',
                {
                  '!text-base-white': !isDarkMode && visible,
                  '!text-gray-900': isDarkMode && visible,
                  '!text-gray-400 group-hover:!text-gray-900':
                    isDarkMode && !visible,
                },
              )}
            />
          </section>
        )}
      </Button>
      <JoinedColoniesPopover
        visible={visible}
        getTooltipProps={getTooltipProps}
        setTooltipRef={setTooltipRef}
        enableMobileAndDesktopLayoutBreakpoints={
          enableMobileAndDesktopLayoutBreakpoints
        }
      />
    </>
  );
};

ColonySwitcher.displayName = displayName;

export default ColonySwitcher;
