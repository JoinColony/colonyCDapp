import React from 'react';
import classnames from 'classnames';

import styles from './HamburgerMenu.css';

const displayName = 'HamburgerMenu';

interface Props {
  isOpen: boolean;
}

const MenuLine = ({ isOpen }: Props) => (
  <div
    className={classnames(styles.menuLine, {
      [styles.menuOpen]: isOpen,
    })}
  />
);

const HamburgerMenu = ({ isOpen }: Props) => {
  return (
    <div className={styles.main}>
      <MenuLine isOpen={isOpen} />
      <MenuLine isOpen={isOpen} />
      <MenuLine isOpen={isOpen} />
    </div>
  );
};

HamburgerMenu.displayName = displayName;

export default HamburgerMenu;
