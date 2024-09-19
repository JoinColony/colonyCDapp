import React from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import Button from '~v5/shared/Button/Button.tsx';
import { useCreateNewColony } from '~v5/shared/Navigation/hooks/useCreateNewColony/index.ts';
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

  const handleCreateNewColony = useCreateNewColony();

  return visible ? (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={getTooltipProps}
      classNames="z-top bg-white w-[252px] rounded-lg border-gray-200 border-[1px] mt-4 shadow-none max-h-[calc(100vh-32px)] p-2"
    >
      <div className="flex max-h-[calc(536px)] flex-col gap-4 overflow-hidden">
        {wallet ? (
          <div className="flex flex-col gap-1.5 overflow-y-auto">
            <JoinedColoniesList
              enableMobileAndDesktopLayoutBreakpoints={
                enableMobileAndDesktopLayoutBreakpoints
              }
            />
          </div>
        ) : (
          <div className="px-2 pt-2">
            <ConnectWalletSection />
          </div>
        )}
        <div className="w-full flex-shrink-0 px-2 pb-2">
          {wallet ? (
            <Button
              mode="primaryOutline"
              text={{ id: 'button.createNewColony' }}
              size="medium"
              className="w-full border-gray-300"
              onClick={handleCreateNewColony}
            />
          ) : (
            <Button
              mode="primaryOutlineFull"
              text={{ id: 'button.connectWallet' }}
              size="medium"
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
