import { ApolloProvider } from '@apollo/client';
import { useIntl } from 'react-intl';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import UserHub from '~common/Extensions/UserHub';
import UserNavigation from '~common/Extensions/UserNavigation';
import Token from '~common/Extensions/UserNavigation/partials/Token';
import { ContextModule, getContext } from '~context';
import { useDetectClickOutside, useMobile } from '~hooks';
import Button, { Hamburger } from '~v5/shared/Button';
import UserAvatar from '~v5/shared/UserAvatar';
import Icon from '~shared/Icon';

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

  const nativeToken = {
    name: 'Gnosis Chain',
    chainId: 100,
    shortName: 'xDai',
    displayENSDomain: 'joincolony.colonyxdai',
    blockExplorerName: 'Gnosisscan',
    blockExplorerUrl: 'https://blockscout.com/poa/xdai',
    tokenExplorerLink: 'https://blockscout.com/poa/xdai/tokens',
    contractAddressLink: 'https://blockscout.com/poa/xdai/address',
    iconName: 'gnosis',
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
          <div className="flex justify-end mb-2">
            <button
              type="button"
              aria-label={formatMessage({ id: 'ariaLabel.closeDropdown' })}
              onClick={() => setIsOpen(false)}
              className="text-gray-400 sm:pr-4"
            >
              <Icon name="close" appearance={{ size: 'extraTiny' }} />
            </button>
          </div>
        )}
        <div className="flex w-full justify-end gap-1">
          {nativeToken && <Token nativeToken={nativeToken} />}
          <Button
            mode="tertiary"
            isFullRounded
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-3">
              <UserAvatar userName="panda" size="xxs" />
            </div>
          </Button>
          <Button mode="tertiary" isFullRounded iconName="list" />
        </div>
        {!isMobile && isOpen && (
          <div
            className={`flex absolute right-[4.25rem] h-auto bg-white shadow-default
            border border-gray-200 rounded-lg mt-2 w-[44.375rem]`}
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
      <Button mode="tertiary" iconName="cardholder" isFullRounded size="small">
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
