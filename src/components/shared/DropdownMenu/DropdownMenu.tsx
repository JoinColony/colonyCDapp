import React, { HTMLAttributes } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './DropdownMenu.css';

interface Appearance {
  theme?: 'dark';
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  /** Appearance object */
  appearance?: Appearance;
}

const displayName = 'DropdownMenu';

const DropdownMenu = ({ appearance, children, ...props }: Props) => (
  <div className={getMainClasses(appearance, styles as unknown as { [k: string]: string })} {...props}>
    {children}
  </div>
);

DropdownMenu.displayName = displayName;

export default DropdownMenu;
