import React, { KeyboardEvent } from 'react';
import { MessageDescriptor } from 'react-intl';
import { useLocation } from 'react-router-dom';

import NavLink from '~shared/NavLink';
import { ENTER } from '~types/index';
import { formatText } from '~utils/intl';

import styles from './NavItem.css';

export interface NavItemProps {
  disabled?: boolean;
  // exact?: boolean;
  linkTo: string;
  showDot?: boolean;
  text: MessageDescriptor;
  dataTest?: string;
}

const displayName = 'common.ColonyHome.ColonyNavigation.NavItem';

const handleLinkKeyDown = (
  evt: KeyboardEvent<HTMLAnchorElement>,
  disabled: boolean,
) => {
  if (disabled && evt.key === ENTER) {
    evt.preventDefault();
  }
};

const getClassNames = (
  showDot: boolean,
  linkTo: string,
  currentLocation: string,
) => {
  const classNames = [styles.main];

  if (showDot) {
    classNames.push(styles.showDot);
  }

  if (linkTo === currentLocation) {
    classNames.push(styles.active);
  }

  return classNames;
};

const NavItem = ({
  disabled = false,
  linkTo,
  showDot = false,
  text: textProp,
  dataTest,
}: NavItemProps) => {
  const text = formatText(textProp);
  const { pathname } = useLocation();
  const classNames = getClassNames(showDot, linkTo, pathname);

  return (
    <NavLink
      activeClassName={styles.active}
      aria-disabled={disabled}
      className={classNames.join(' ')}
      onKeyDown={(e) => handleLinkKeyDown(e, disabled)}
      to={linkTo}
      data-test={dataTest}
    >
      <span className={styles.text}>{text}</span>
    </NavLink>
  );
};

NavItem.displayName = displayName;

export default NavItem;
