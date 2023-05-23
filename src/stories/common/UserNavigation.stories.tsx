import { ApolloProvider } from '@apollo/client';
import { useIntl } from 'react-intl';
import type { Meta, StoryObj } from '@storybook/react';

import React, { useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import UserHub from '~common/Extensions/UserHub';
import UserNavigation from '~common/Extensions/UserNavigation';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';
import Token from '~common/Extensions/UserNavigation/partials/Token';
import { ContextModule, getContext } from '~context';
import { useDetectClickOutside, useMobile } from '~hooks';
import Button from '~shared/Extensions/Button';
import UserAvatar from '~shared/Extensions/UserAvatar';
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
    decimals: 18,
    name: 'Gnosis',
    symbol: 'TKN',
    tokenAddress: '0x123',
  };

  const userReputation = '100';
  const totalReputation = '1000';

  const { setTooltipRef } = usePopperTooltip({
    delayShow: 200,
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
              aria-label={formatMessage({ id: 'close.dropdown' })}
              onClick={() => setIsOpen(false)}
              className="text-gray-400 sm:pr-4"
            >
              <Icon name="close" appearance={{ size: 'extraTiny' }} />
            </button>
          </div>
        )}
        <div className="flex items-center w-full justify-end gap-1">
          {nativeToken && <Token nativeToken={nativeToken} />}

          <Button mode="tertiaryOutline" isFullRounded onClick={() => setIsOpen(!isOpen)}>
            <div className="flex items-center gap-3">
              <UserAvatar userName="panda" size="xxs" />
              <MemberReputation userReputation={userReputation} totalReputation={totalReputation} />
            </div>
          </Button>
          <Button mode="tertiaryOutline" isFullRounded>
            <Icon name="list" appearance={{ size: 'tiny' }} />
          </Button>
        </div>
        {!isMobile && isOpen && (
          <div
            className={`flex absolute right-[4.2rem] h-auto bg-white shadow-default
            border border-gray-200 rounded mt-2 w-[44.375rem]`}
            ref={setTooltipRef}
          >
            <UserHub />
          </div>
        )}
        {isMobile && isOpen && <UserHub />}
      </div>
    </ApolloProvider>
  );
};

const UserNavigationNotConnected = () => (
  <div className="flex items-center w-full justify-end gap-1">
    <Button mode="tertiaryOutline" isFullRounded>
      <Icon name="cardholder" appearance={{ size: 'tiny' }} />
      <p className="text-sm font-inter font-medium ml-1">Connect wallet</p>
    </Button>
    <Button mode="tertiaryOutline" isFullRounded>
      <Icon name="list" appearance={{ size: 'tiny' }} />
    </Button>
  </div>
);

export const WalletConnected: Story = {
  render: () => <UserNavigationWithData />,
};

export const WalletNotConnected: Story = {
  render: () => <UserNavigationNotConnected />,
};
