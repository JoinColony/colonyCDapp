import React from 'react';

import Button from '~v5/shared/Button/Button.tsx';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import JoinedColoniesList from '../JoinedColoniesList/JoinedColoniesList.tsx';

import { type JoinedColoniesPopoverProps } from './types.ts';

const displayName =
  'v5.common.Navigation.ColonySwitcher.partials.JoinedColoniesPopover';

const JoinedColoniesPopover = ({
  visible,
  setTooltipRef,
  getTooltipProps,
}: JoinedColoniesPopoverProps) => {
  return visible ? (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={getTooltipProps}
      classNames="bg-white w-[252px] py-4 px-2 rounded-lg border-gray-200 border-[1px] shadow-none mt-4 gap-2"
    >
      <JoinedColoniesList />
      <section className="w-full px-2 pt-2">
        <Button
          mode="primaryOutlineFull"
          text={{ id: 'button.createNewColony' }}
          className="w-full border-gray-300"
        />
      </section>
    </PopoverBase>
  ) : null;
};

JoinedColoniesPopover.displayName = displayName;

export default JoinedColoniesPopover;
