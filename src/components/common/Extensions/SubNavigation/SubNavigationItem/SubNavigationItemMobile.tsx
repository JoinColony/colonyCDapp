import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';

import Button from '~shared/Extensions/Button/Button';
import Icon from '~shared/Icon/Icon';

import { SubNavigationItemProps } from './types';
import styles from './SubNavigationItemMobile.module.css';

const displayName = 'common.Extensions.SubNavigation.SubNavigationItem.SubNavigationItemMobile';

const SubNavigationItemMobile: React.FC<PropsWithChildren<SubNavigationItemProps>> = ({
  label,
  content,
  isOpen,
  setOpen,
  icon,
}) => {
  return (
    <li>
      <Button onClick={setOpen} mode="textButton" className={clsx(styles.button, { [styles.activeButton]: isOpen })}>
        <Icon name={icon} />
        <div>{label}</div>
      </Button>
      {isOpen && <div className={styles.dropdownContent}>{content}</div>}
    </li>
  );
};

SubNavigationItemMobile.displayName = displayName;

export default SubNavigationItemMobile;
