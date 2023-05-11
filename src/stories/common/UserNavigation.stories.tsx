import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import UserNavigation from '~common/Extensions/UserNavigation';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';
import Token from '~common/Extensions/UserNavigation/partials/Token';
import Button from '~shared/Extensions/Button';
import UserAvatar from '~shared/Extensions/UserAvatar';
import Icon from '~shared/Icon';

const meta: Meta<typeof UserNavigation> = {
  title: 'Common/UserNavigation',
  component: UserNavigation,
};

export default meta;
type Story = StoryObj<typeof UserNavigation>;

const UserNavigationWithData = () => {
  const nativeToken = {
    decimals: 18,
    name: 'Gnosis',
    symbol: 'TKN',
    tokenAddress: '0x123',
  };

  const userReputation = '100';
  const totalReputation = '1000';

  return (
    <div className="flex items-center gap-1">
      {nativeToken && <Token nativeToken={nativeToken} />}
      <Button mode="tertiaryOutline" isFullRounded>
        <div className="flex items-center gap-3">
          <UserAvatar userName="panda" size="xxs" isLink={false} />
          <MemberReputation userReputation={userReputation} totalReputation={totalReputation} />
        </div>
      </Button>
      <Button mode="tertiaryOutline" isFullRounded>
        <Icon name="list" appearance={{ size: 'tiny' }} />
      </Button>
    </div>
  );
};

const UserNavigationNotConnected = () => (
  <div className="flex items-center gap-1">
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
