import { ApolloProvider } from '@apollo/client';
import { Cardholder, List, X } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';

import UserHub from '~common/Extensions/UserHub/index.ts';
import UserNavigation from '~common/Extensions/UserNavigation/index.ts';
import NetworkName from '~common/Extensions/UserNavigation/partials/NetworkName/index.ts';
import { ADDRESS_ZERO } from '~constants';
import { ContextModule, getContext } from '~context/index.ts';
import { useMobile } from '~hooks/index.ts';
import useDetectClickOutside from '~hooks/useDetectClickOutside.ts';
import GnosisIcon from '~icons/GnosisIcon.tsx';
import Button, { Hamburger } from '~v5/shared/Button/index.ts';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof UserNavigation> = {
  title: 'Common/User Navigation',
  component: UserNavigation,
};

export default meta;
type Story = StoryObj<typeof UserNavigation>;

const UserNavigationWithData = () => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>();

  const ref = useDetectClickOutside({ onTriggered: () => setIsOpen(false) });

  const networkInfo = {
    name: 'Gnosis Chain',
    chainId: '100',
    shortName: 'xDai',
    displayENSDomain: 'joincolony.colonyxdai',
    blockExplorerName: 'Gnosisscan',
    blockExplorerUrl: 'https://blockscout.com/poa/xdai',
    tokenExplorerLink: 'https://blockscout.com/poa/xdai/tokens',
    contractAddressLink: 'https://blockscout.com/poa/xdai/address',
    icon: GnosisIcon,
  };

  const { setTooltipRef } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'bottom',
    trigger: 'click',
    visible: isOpen,
    interactive: true,
  });

  const apolloClient = getContext(ContextModule.ApolloClient);

  return (
    <ApolloProvider client={apolloClient}>
      <div ref={ref}>
        {isMobile && isOpen && (
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              aria-label={formatMessage({ id: 'ariaLabel.closeDropdown' })}
              onClick={() => setIsOpen(false)}
              className="text-gray-400 sm:pr-4"
            >
              <X size={12} />
            </button>
          </div>
        )}
        <div className="flex w-full justify-end gap-1">
          {networkInfo && <NetworkName networkInfo={networkInfo} />}
          <Button
            mode="tertiary"
            isFullRounded
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-3">
              <UserAvatar
                userName="Panda"
                userAddress={ADDRESS_ZERO}
                size={16}
              />
            </div>
          </Button>
          <Button mode="tertiary" isFullRounded icon={List} />
        </div>
        {!isMobile && isOpen && (
          <div
            className={`absolute right-[4.25rem] mt-2 flex h-auto w-[44.375rem]
            rounded-lg border border-gray-200 bg-base-white shadow-default`}
            ref={setTooltipRef}
          >
            {/* @ts-ignore */}
            <UserHub />
          </div>
        )}
        {/* @ts-ignore */}
        {isMobile && isOpen && <UserHub />}
      </div>
    </ApolloProvider>
  );
};

const UserNavigationNotConnected = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="flex w-full justify-end gap-1">
      <Button mode="tertiary" icon={Cardholder} isFullRounded size="small">
        {formatMessage({ id: 'connectWallet' })}
      </Button>
      <Hamburger />
    </div>
  );
};

export const WalletConnected: Story = {
  render: () => <UserNavigationWithData />,
};

export const WalletNotConnected: Story = {
  render: () => <UserNavigationNotConnected />,
};
