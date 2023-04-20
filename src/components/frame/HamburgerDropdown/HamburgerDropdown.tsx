import React from 'react';
import classnames from 'classnames';

import HamburgerMenu from '~shared/HamburgerMenu/HamburgerMenu';
import Popover from '~shared/Popover';
import HamburgerDropdownPopover from './HamburgerDropdownPopover';

import styles from './HamburgerDropdown.css';

const displayName = 'frame.HamburgerDropdown';

const HamburgerDropdown = () => {
  return (
    <Popover
      renderContent={({ close }) => <HamburgerDropdownPopover closePopover={close} />}
      trigger="click"
      showArrow={false}
      placement="bottom"
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 0],
            },
          },
        ],
      }}
    >
      {({ isOpen, toggle, ref, id }) => (
        <button
          id={id}
          ref={ref}
          className={classnames(styles.hamburgerButton, {
            [styles.activeDropdown]: isOpen,
          })}
          onClick={toggle}
          type="button"
          data-test="hamburgerDropdown"
        >
          <HamburgerMenu {...{ isOpen }} />
        </button>
      )}
    </Popover>
  );
};

HamburgerDropdown.displayName = displayName;

export default HamburgerDropdown;
