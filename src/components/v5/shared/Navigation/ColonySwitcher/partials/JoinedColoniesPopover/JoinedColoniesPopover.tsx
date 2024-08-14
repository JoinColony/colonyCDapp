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
}: JoinedColoniesPopoverProps) => {
  const { wallet, connectWallet } = useAppContext();

  return visible ? (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={getTooltipProps}
      classNames="z-top bg-white w-[252px] py-4 px-2 rounded-lg border-gray-200 border-[1px] shadow-none mt-4 gap-2"
    >
      {wallet ? <JoinedColoniesList /> : <ConnectWalletSection />}
      <section className="w-full px-2 pt-2">
        {wallet ? (
          <Button
            mode="primaryOutlineFull"
            text={{ id: 'button.createNewColony' }}
            size="medium"
            className="w-full border-gray-300"
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
      </section>
    </PopoverBase>
  ) : null;
};

JoinedColoniesPopover.displayName = displayName;

export default JoinedColoniesPopover;
