import type { Meta, StoryObj } from '@storybook/react';
import clsx from 'clsx';

import React, { useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { BrowserRouter as Router } from 'react-router-dom';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';
import Token from '~common/Extensions/UserNavigation/partials/Token';
import UserMenu from '~common/Extensions/UserNavigation/partials/UserMenu';
import { useMobile } from '~hooks';
import Button from '~shared/Extensions/Button';
import UserAvatar from '~shared/Extensions/UserAvatar/UserAvatar';
import Icon from '~shared/Icon';
import { formatMessage } from '~utils/yup/tests/helpers';

const meta: Meta<typeof UserMenu> = {
  title: 'Common/UserMenu',
  component: UserMenu,
};

export default meta;
type Story = StoryObj<typeof UserMenu>;

const UserNavigationMenuNotConnected = () => {
  const isMobile = useMobile();

  const popperTooltipOffset = !isMobile ? [0, 8] : [0, 0];
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip(
    {
      delayShow: 200,
      placement: 'bottom-start',
      trigger: 'click',
      interactive: true,
    },
    {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: popperTooltipOffset,
          },
        },
      ],
    },
  );

  const isWalletConnected = false;
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  return (
    <Router>
      <div className="w-full flex justify-end relative">
        <div className="flex items-center gap-1">
          {isButtonVisible && (
            <Button mode="tertiaryOutline" isFullRounded>
              <Icon name="cardholder" appearance={{ size: 'tiny' }} />
              <p className="text-sm font-inter font-medium ml-1">{formatMessage({ id: 'connectWallet' })}</p>
            </Button>
          )}
          <div>
            <Button
              className={clsx({
                'px-4 py-2.5 !border-base-white': visible && isMobile,
                'p-0': !visible && isMobile,
              })}
              mode="tertiaryOutline"
              isFullRounded
              setTriggerRef={setTriggerRef}
              onClick={() => isMobile && setIsButtonVisible((prevState) => !prevState)}
            >
              <Icon name={visible && isMobile ? 'close' : 'list'} appearance={{ size: 'tiny' }} />
            </Button>
            <div className="w-full h-auto absolute top-[6.5rem] md:top-[2.3rem]">
              {visible && (
                <UserMenu
                  tooltipProps={getTooltipProps}
                  setTooltipRef={setTooltipRef}
                  isWalletConnected={isWalletConnected}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

const UserNavigationMenuConnected = () => {
  const isMobile = useMobile();

  const popperTooltipOffset = !isMobile ? [0, 8] : [0, 0];
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip(
    {
      delayShow: 200,
      placement: 'bottom-start',
      trigger: 'click',
      interactive: true,
    },
    {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: popperTooltipOffset,
          },
        },
      ],
    },
  );
  const nativeToken = {
    decimals: 18,
    name: 'Gnosis',
    symbol: 'TKN',
    tokenAddress: '0x123',
  };

  const userReputation = '100';
  const totalReputation = '1000';

  const isWalletConnected = true;
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  return (
    <Router>
      <div className="w-full flex justify-end relative">
        <div className="flex items-center gap-1">
          {isButtonVisible && (
            <div className="flex items-center w-full justify-end gap-1">
              {nativeToken && <Token nativeToken={nativeToken} />}
              <Button mode="tertiaryOutline" isFullRounded>
                <div className="flex items-center gap-3">
                  <UserAvatar userName="panda" size="xxs" isLink={false} />
                  <MemberReputation userReputation={userReputation} totalReputation={totalReputation} />
                </div>
              </Button>
            </div>
          )}
          <div>
            <Button
              className={clsx({
                'px-4 py-2.5 !border-base-white': visible && isMobile,
                'p-0': !visible && isMobile,
              })}
              mode="tertiaryOutline"
              isFullRounded
              setTriggerRef={setTriggerRef}
              onClick={() => isMobile && setIsButtonVisible((prevState) => !prevState)}
            >
              <Icon name={visible && isMobile ? 'close' : 'list'} appearance={{ size: 'tiny' }} />
            </Button>
            <div className="w-full h-auto absolute top-[6.5rem] md:top-[2.3rem]">
              {visible && (
                <UserMenu
                  tooltipProps={getTooltipProps}
                  setTooltipRef={setTooltipRef}
                  isWalletConnected={isWalletConnected}
                  nativeToken={nativeToken}
                  userName="panda"
                  walletAddress="0x155....1051"
                  userReputation={userReputation}
                  totalReputation={totalReputation}
                  copyUrl
                  isVerified
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export const WalletNotConnected: Story = {
  render: () => <UserNavigationMenuNotConnected />,
};

export const WalletConnected: Story = {
  render: () => <UserNavigationMenuConnected />,
};
