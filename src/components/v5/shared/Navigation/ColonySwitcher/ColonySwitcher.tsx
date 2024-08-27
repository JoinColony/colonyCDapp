import { CaretUpDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { defineMessages } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
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

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      placement: 'right',
      trigger: 'click',
      interactive: true,
      offset: offset ?? [-20, 16],
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
          '!bg-gray-800': visible,
          '!p-2 hover:!bg-gray-800': enableMobileAndDesktopLayoutBreakpoints,
        })}
      >
        <section className="flex flex-row items-center gap-3 overflow-hidden">
          <ColonySwitcherAvatar
            enableMobileAndDesktopLayoutBreakpoints={
              enableMobileAndDesktopLayoutBreakpoints
            }
          />
          {showColonySwitcherText && (
            <p className="truncate text-md font-semibold text-base-white">
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
                  '!text-base-white': visible,
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
