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
      classNames="z-top bg-white w-[252px] rounded-lg border-gray-200 mt-4 shadow-none max-h-[calc(100vh-32px)] pb-4 pt-0 px-0"
    >
      <div className="flex max-h-[calc(536px)] flex-col gap-6 overflow-hidden">
        {wallet ? (
          <JoinedColoniesList
            enableMobileAndDesktopLayoutBreakpoints={
              enableMobileAndDesktopLayoutBreakpoints
            }
          />
        ) : (
          <div className="px-4 pt-4">
            <ConnectWalletSection />
          </div>
        )}
        <div className="w-full flex-shrink-0 px-4">
          {wallet ? (
            <Button
              mode="primaryOutline"
              text={{ id: 'button.createNewColony' }}
              size="small"
              className="w-full border-gray-300"
            />
          ) : (
            <Button
              mode="primaryOutline"
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
