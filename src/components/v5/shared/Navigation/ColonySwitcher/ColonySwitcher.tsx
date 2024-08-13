import { CaretUpDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { capitalizeFirstLetter } from '~utils/strings.ts';
import Button from '~v5/shared/Button/index.ts';

import { sidebarButtonClass } from '../Sidebar/sidebar.styles.ts';

import { ColonySwitcherAvatar } from './partials/ColonySwitcherAvatar.tsx';
import JoinedColoniesPopover from './partials/JoinedColoniesPopover/JoinedColoniesPopover.tsx';
import { type ColonySwitcherProps } from './types.ts';

const displayName = 'v5.common.Navigation.ColonySwitcher';

const ColonySwitcher: React.FC<ColonySwitcherProps> = ({
  isLogoButton,
  offset,
  className,
}) => {
  const colonyContext = useColonyContext({ nullableContext: true });

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      placement: 'right',
      trigger: 'click',
      interactive: true,
      offset: offset ?? [-20, 18],
    });

  return (
    <>
      <Button
        ref={setTriggerRef}
        type="button"
        className={clsx(sidebarButtonClass, className, '!py-[6px]', {
          '!justify-center': isLogoButton,
          '!justify-between': !isLogoButton,
        })}
      >
        <section className="flex flex-row items-center gap-3">
          <ColonySwitcherAvatar />
          {colonyContext?.colony.name && (
            <p className="text-md font-semibold text-base-white">
              {capitalizeFirstLetter(colonyContext.colony.name)}
            </p>
          )}
        </section>
        {!isLogoButton && (
          <section>
            <CaretUpDown className="h-3 w-auto flex-shrink-0 text-gray-400" />
          </section>
        )}
      </Button>
      <JoinedColoniesPopover
        visible={visible}
        getTooltipProps={getTooltipProps}
        setTooltipRef={setTooltipRef}
      />
    </>
  );
};

ColonySwitcher.displayName = displayName;

export default ColonySwitcher;
