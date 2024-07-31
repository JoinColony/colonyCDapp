import { CaretUpDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useTablet } from '~hooks';
import { capitalizeFirstLetter } from '~utils/strings.ts';
import { sidebarButtonStyles } from '~v5/common/Navigation/consts.ts';
import Button from '~v5/shared/Button/index.ts';

import ColonySwitcherAvatar from './partials/ColonySwitcherAvatar/ColonySwitcherAvatar.tsx';
import JoinedColoniesPopover from './partials/JoinedColoniesPopover/JoinedColoniesPopover.tsx';
import { type ColonySwitcherProps } from './types.ts';

const displayName = 'v5.common.Navigation.ColonySwitcher';

const ColonySwitcher: React.FC<ColonySwitcherProps> = ({
  colonyContext,
  isLogoButton,
}) => {
  const isTablet = useTablet();

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      placement: 'right',
      trigger: 'click',
      interactive: true,
      offset: [0, 18],
    });

  return (
    <>
      <Button
        ref={setTriggerRef}
        type="button"
        className={clsx(sidebarButtonStyles, '!py-1', {
          '!justify-center': isLogoButton,
          '!justify-between': !isLogoButton,
        })}
      >
        <section className="flex flex-row items-center gap-3">
          <ColonySwitcherAvatar colonyContext={colonyContext} />
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
      {!isTablet && (
        <JoinedColoniesPopover
          visible={visible}
          getTooltipProps={getTooltipProps}
          setTooltipRef={setTooltipRef}
        />
      )}
    </>
  );
};

ColonySwitcher.displayName = displayName;

export default ColonySwitcher;
