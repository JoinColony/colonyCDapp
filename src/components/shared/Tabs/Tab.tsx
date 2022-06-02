import React, { HTMLAttributes } from 'react';
import { Tab as ReactTab } from 'react-tabs';

import styles from './Tab.css';

interface Props extends HTMLAttributes<any> {
  /** Disable this tab which will make it not do anything when clicked. */
  disabled?: boolean;

  selectedClassName?: string;
  disabledClassName?: string;
  className?: string;
}

const displayName = 'Tab';

const Tab = ({ className, tabIndex, ...otherProps }: Props) => (
  <ReactTab
    className={className || styles.main}
    selectedClassName={styles.selected}
    disabledClassName={styles.disabled}
    tabIndex={tabIndex?.toString()}
    {...otherProps}
  />
);

Tab.tabsRole = 'Tab';

Tab.displayName = displayName;

export default Tab;
