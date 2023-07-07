import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  mockNativeToken,
  mockTotalReputation,
  mockUser,
  mockUserReputation,
} from '~common/Extensions/UserNavigation/consts';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';
import Token from '~common/Extensions/UserNavigation/partials/Token';
import UserMenu from '~common/Extensions/UserNavigation/partials/UserMenu';
import { useMobile } from '~hooks';
import Button, { Hamburger } from '~v5/shared/Button';
import UserAvatar from '~v5/shared/UserAvatar';
import { formatMessage } from '~utils/yup/tests/helpers';

const meta: Meta<typeof UserMenu> = {
  title: 'Common/User Menu',
  component: UserMenu,
};

export default meta;
type Story = StoryObj<typeof UserMenu>;

const UserNavigationMenuNotConnected = () => {
  const isMobile = useMobile();
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isWalletButtonVisible, setIsWalletButtonVisible] = useState(true);

  const popperTooltipOffset = !isMobile ? [0, 8] : [0, 0];
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(
      {
        delayShow: 200,
        delayHide: 200,
        placement: 'bottom-start',
        trigger: 'click',
        interactive: true,
        onVisibleChange: (newVisible) => {
          if (!newVisible && isMobile) {
            setIsButtonVisible(true);
          }
        },
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
  const { setTriggerRef: setWalletTriggerRef, visible: isWalletVisible } =
    usePopperTooltip(
      {
        delayHide: 200,
        placement: 'bottom-end',
        trigger: 'click',
        interactive: true,
        onVisibleChange: (newVisible) => {
          if (!newVisible && isMobile) {
            setIsWalletButtonVisible(true);
          }
        },
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

  return (
    <Router>
      <div className="w-full flex justify-end relative">
        <div className="flex gap-1">
          {isButtonVisible && (
            <Button
              mode="tertiary"
              size="small"
              isFullRounded
              setTriggerRef={setWalletTriggerRef}
              iconName={isWalletVisible && isMobile ? 'close' : 'cardholder'}
              onClick={() =>
                isMobile && setIsWalletButtonVisible((prevState) => !prevState)
              }
            >
              {isWalletButtonVisible && formatMessage({ id: 'connectWallet' })}
            </Button>
          )}
          <div>
            {isWalletButtonVisible && (
              <Hamburger
                isOpened={visible && isMobile}
                iconName={visible && isMobile ? 'close' : 'list'}
                setTriggerRef={setTriggerRef}
                onClick={() =>
                  isMobile && setIsButtonVisible((prevState) => !prevState)
                }
              />
            )}
            <div className="w-full h-auto top-[6.5rem] md:top-[2.3rem]">
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
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(
      {
        delayHide: 200,
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

  const isWalletConnected = true;
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  return (
    <Router>
      <div className="w-full flex justify-end relative">
        <div className="flex gap-1">
          {isButtonVisible && (
            <div className="flex items-center w-full justify-end gap-1">
              {mockNativeToken && <Token nativeToken={mockNativeToken} />}
              <Button mode="tertiary" isFullRounded>
                <div className="flex items-center gap-3">
                  <UserAvatar userName="panda" size="xxs" />
                  <MemberReputation
                    userReputation={mockUserReputation}
                    totalReputation={mockTotalReputation}
                  />
                </div>
              </Button>
            </div>
          )}
          <div>
            <Hamburger
              isOpened={visible && isMobile}
              iconName={visible && isMobile ? 'close' : 'list'}
              setTriggerRef={setTriggerRef}
              onClick={() =>
                isMobile && setIsButtonVisible((prevState) => !prevState)
              }
            />
            <div className="w-full h-auto top-[6.5rem] md:top-[2.3rem]">
              {visible && (
                <UserMenu
                  tooltipProps={getTooltipProps}
                  setTooltipRef={setTooltipRef}
                  isWalletConnected={isWalletConnected}
                  nativeToken={mockNativeToken}
                  user={mockUser}
                  walletAddress="0x155....1051"
                  userReputation={mockUserReputation}
                  totalReputation={mockTotalReputation}
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
