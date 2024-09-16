import React from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import Button from '~v5/shared/Button/Button.tsx';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import JoinedColoniesList from '../JoinedColoniesList.tsx';
import { ConnectWalletSection } from '../TitleSections/ConnectWalletSection.tsx';

import { type JoinedColoniesPopoverProps } from './types.ts';

const displayName =
  'v5.common.Navigation.ColonySwitcher.partials.JoinedColoniesPopover';

const JoinedColoniesPopover = ({
  visible,
  setTooltipRef,
  getTooltipProps,
  enableMobileAndDesktopLayoutBreakpoints,
}: JoinedColoniesPopoverProps) => {
  const { wallet, connectWallet } = useAppContext();

  return visible ? (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={getTooltipProps}
      classNames="z-top bg-white w-[252px] rounded-lg border-gray-200 border-[1px] mt-4 shadow-none max-h-[calc(100vh-32px)] p-3"
    >
      <div className="flex max-h-[calc(536px)] flex-col gap-[22px] overflow-hidden">
        {wallet ? (
          <div className="flex flex-col gap-1.5 overflow-y-auto">
            <JoinedColoniesList
              enableMobileAndDesktopLayoutBreakpoints={
                enableMobileAndDesktopLayoutBreakpoints
              }
            />
          </div>
        ) : (
          <ConnectWalletSection />
        )}
        <div className="w-full flex-shrink-0 px-1 pb-1">
          {wallet ? (
            <Button
              mode="primaryOutlineFull"
              text={{ id: 'button.createNewColony' }}
              size="small"
              className="w-full border-gray-300"
            />
          ) : (
            <Button
              mode="primaryOutlineFull"
              text={{ id: 'button.connectWallet' }}
              size="small"
              className="w-full border-gray-300"
              onClick={connectWallet}
            />
          )}
        </div>
      </div>
    </PopoverBase>
  ) : null;
};

JoinedColoniesPopover.displayName = displayName;

export default JoinedColoniesPopover;
