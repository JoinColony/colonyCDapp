import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';

import Button from '~shared/Extensions/Button/Button';

import { SubNavigationItemMobileProps } from './types';
import styles from './SubNavigationItemMobile.module.css';

const displayName = 'Extensions.SubNavigation.SubNavigationItemMobile';

const SubNavigationItemMobile: React.FC<PropsWithChildren<SubNavigationItemMobileProps>> = ({
  label,
  content,
  isOpen,
  setOpen,
  id,
}) => {
  return (
    <li>
      <Button
        onClick={() => setOpen(id)}
        mode="textButton"
        className={clsx(styles.button, { [styles.activeButton]: isOpen })}
      >
        <div>{label}</div>
      </Button>
      {isOpen && <div className="border border-gray-200 rounded-md mt-4">{content}</div>}
    </li>
  );
};

SubNavigationItemMobile.displayName = displayName;

export default SubNavigationItemMobile;
