import React, { useMemo } from 'react';
import classnames from 'classnames';
import { useMediaQuery } from 'react-responsive';

import Popover from '~shared/Popover';
import UserAvatar from '~shared/UserAvatar';
import { useAppContext, useColonyContext } from '~hooks';
import { removeValueUnits } from '~utils/css';
import { SimpleMessageValues } from '~types/index';
// import { UserTokenBalanceData } from '~types/tokens';
import AvatarDropdownPopover from './AvatarDropdownPopover';
import AvatarDropdownPopoverMobile from './AvatarDropdownPopoverMobile';

import styles from './AvatarDropdown.css';
import queries from '~styles/queries.css';

interface Props {
  preventTransactions?: boolean;
  spinnerMsg: SimpleMessageValues;
  // tokenBalanceData: UserTokenBalanceData;
}

const displayName = 'frame.AvatarDropdown';

const { query700: query } = queries;
const { refWidth, horizontalOffset, verticalOffset } = styles;

const AvatarDropdown = ({ preventTransactions = false, spinnerMsg }: Props) => {
  const isMobile = useMediaQuery({ query });
  const { wallet, user } = useAppContext();
  const { colony } = useColonyContext();

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
        user?.name &&
        wallet?.address &&
        colony && (
          <AvatarDropdownPopoverMobile
            {...{
              spinnerMsg,
              // tokenBalanceData,
            }}
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
          {wallet?.address && (
            <UserAvatar
              address={wallet?.address}
              size={isMobile ? 'xs' : 's'}
              user={user}
            />
          )}
        </button>
      )}
    </Popover>
  );
};

AvatarDropdown.displayName = displayName;

export default AvatarDropdown;
