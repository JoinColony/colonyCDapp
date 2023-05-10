import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import UserNavigation from '~common/Extensions/UserNavigation';
import MemberReputation from '~common/Extensions/UserNavigation/MemberReputation/MemberReputation';
import Token from '~common/Extensions/UserNavigation/Token/Token';
import Button from '~shared/Extensions/Button/Button';
import UserAvatar from '~shared/Extensions/UserAvatar/UserAvatar';
import Icon from '~shared/Icon/Icon';

const meta: Meta<typeof UserNavigation> = {
  title: 'Common/UserNavigation',
  component: UserNavigation,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof UserNavigation>;

export const UserNavigationWithData = () => {
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
      <Button mode="tertiaryOutline" fullRounded>
        <div className="flex items-center gap-3">
          <UserAvatar userName="panda" size="xxs" isLink={false} />
          <MemberReputation userReputation={userReputation} totalReputation={totalReputation} />
        </div>
      </Button>
      <Button mode="tertiaryOutline" fullRounded>
        <Icon name="list" appearance={{ size: 'tiny' }} />
      </Button>
    </div>
  );
};

export const Base: Story = {
  args: {},
};
