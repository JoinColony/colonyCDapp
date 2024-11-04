import clsx from 'clsx';
import React from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import Button from '~v5/shared/Button/Button.tsx';
import { useCreateColonyRedirect } from '~v5/shared/Navigation/hooks/useCreateNewColony/index.ts';
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

  const handleCreateColonyRedirect = useCreateColonyRedirect();
  const { isDarkMode } = usePageThemeContext();

  const ctaCopy = wallet ? 'button.createNewColony' : 'button.connectWallet';
  const handleCTAClick = wallet ? handleCreateColonyRedirect : connectWallet;

  return visible ? (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={getTooltipProps}
      classNames={clsx(
        'bg-white z-top mt-4 max-h-[calc(100%-32px)] w-[252px] rounded-lg border-gray-200 px-0 pb-4 pt-0 shadow-none',
        {
          '!bg-gray-100': isDarkMode,
        },
      )}
    >
      <div className="flex flex-col gap-6 overflow-hidden">
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
          <Button
            mode="quinary"
            text={{ id: ctaCopy }}
            size="small"
            className="w-full !border-gray-300 hover:!border-gray-900"
            onClick={handleCTAClick}
          />
        </div>
      </div>
    </PopoverBase>
  ) : null;
};

JoinedColoniesPopover.displayName = displayName;

export default JoinedColoniesPopover;
