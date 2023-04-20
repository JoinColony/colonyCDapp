import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';

import Button from '~shared/Extensions/Button/Button';

import { SubNavigationItemMobileProps } from './types';
import styles from './SubNavigationItemMobile.module.css';
import Icon from '~shared/Icon/Icon';

const displayName = 'Extensions.SubNavigation.SubNavigationItemMobile';

const SubNavigationItemMobile: React.FC<PropsWithChildren<SubNavigationItemMobileProps>> = ({
  label,
  content,
  isOpen,
  setOpen,
  id,
  icon,
}) => {
  return (
    <li>
      <Button
        onClick={() => setOpen(id)}
        mode="textButton"
        className={clsx(styles.button, { [styles.activeButton]: isOpen })}
      >
        <Icon name={icon} />
        <div>{label}</div>
      </Button>
      {isOpen && <div className={styles.dropdownContent}>{content}</div>}
    </li>
  );
};

SubNavigationItemMobile.displayName = displayName;

export default SubNavigationItemMobile;
