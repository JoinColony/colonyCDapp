import classnames from 'classnames';
import React, { useMemo } from 'react';

import { useAppContext, useMobile } from '~hooks';
import Popover from '~shared/Popover';
import UserAvatar from '~shared/UserAvatar';
import { Colony, UserTokenBalanceData } from '~types';
import { SimpleMessageValues } from '~types/index';
import { removeValueUnits } from '~utils/css';

import AvatarDropdownPopover from './AvatarDropdownPopover';
import AvatarDropdownPopoverMobile from './AvatarDropdownPopoverMobile';

import styles from './AvatarDropdown.css';

interface Props {
  spinnerMsg: SimpleMessageValues;
  colony?: Colony;
  preventTransactions?: boolean;
  tokenBalanceData?: UserTokenBalanceData;
}

const displayName = 'frame.AvatarDropdown';

const { refWidth, horizontalOffset, verticalOffset } = styles;

const AvatarDropdown = ({
  colony,
  preventTransactions = false,
  spinnerMsg,
  tokenBalanceData,
}: Props) => {
  const isMobile = useMobile();
  const { wallet, user } = useAppContext();

  /*
   * @NOTE Offset Calculations
   * See: https://popper.js.org/docs/v2/modifiers/offset/
   *
   * Skidding:
   * The Width of the reference element (width) plus the horizontal offset
   * Note that all skidding, for bottom aligned elements, needs to be negative.
   *
   * Distace:
   * This is just the required offset in pixels. Since we are aligned at
   * the bottom of the screen, this will be added to the bottom of the
   * reference element.
   */
  const popoverOffset = useMemo(() => {
    const skid =
      removeValueUnits(refWidth) + removeValueUnits(horizontalOffset);
    return isMobile ? [-70, 5] : [-1 * skid, removeValueUnits(verticalOffset)];
  }, [isMobile]);

  const popoverContent = isMobile
    ? () =>
        user?.profile?.displayName &&
        wallet?.address && (
          <AvatarDropdownPopoverMobile
            colony={colony}
            spinnerMsg={spinnerMsg}
            tokenBalanceData={tokenBalanceData}
          />
        )
    : ({ close }) => (
        <AvatarDropdownPopover
          closePopover={close}
          walletConnected={!!wallet?.address}
          {...{
            preventTransactions,
          }}
        />
      );
  return (
    <Popover
      renderContent={popoverContent}
      trigger="click"
      showArrow={false}
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: popoverOffset,
            },
          },
        ],
      }}
    >
      {({ isOpen, toggle, ref, id }) => (
        <button
          id={id}
          ref={ref}
          className={classnames(styles.avatarButton, {
            [styles.activeDropdown]: isOpen,
          })}
          onClick={toggle}
          type="button"
          data-test="avatarDropdown"
        >
          <UserAvatar size="s" user={user} notSet={!wallet} />
        </button>
      )}
    </Popover>
  );
};

AvatarDropdown.displayName = displayName;

export default AvatarDropdown;
