import React, { FC, useCallback, useState } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { NavItemProps, NavProps } from '../types';
import Icon from '~shared/Icon';
import styles from '../Nav.module.css';
import SubMenu from '../SubMenu';
import { useMobile } from '~hooks';
import NavMobile from '../NavMobile/NavMobile';

const displayName = 'common.Extensions.MainNavigation.partials.Nav';

const NavItem: FC<NavItemProps> = ({ item }) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const [isOpen, setIsOpen] = useState(false);

  const toggleItem = useCallback(() => {
    setIsOpen(!isOpen);

    if (item.onToggle) {
      item.onToggle(!isOpen);
    }
  }, [isOpen, item]);

  return isMobile ? (
    <NavMobile isOpen={isOpen} toggleItem={toggleItem} item={item} />
  ) : (
    <>
      {item.href ? (
        <a className={styles.navLink} href={item.href}>
          {formatMessage({
            id: `mainNavItem.${item.label}`,
            defaultMessage: `${item.label}`,
          })}
        </a>
      ) : (
        <button
          type="button"
          className={clsx(styles.navLink, 'text-gray-700 group-hover:text-gray-900 group-hover:bg-base-bg')}
          aria-label={`${formatMessage({ id: 'ariaLabel.open' })} ${formatMessage({
            id: `mainNavItem.${item.label}`,
            defaultMessage: `${item.label}`,
          })}`}
        >
          {formatMessage({
            id: `mainNavItem.${item.label}`,
            defaultMessage: `${item.label}`,
          })}
          {item.subMenu && (
            <span className="flex ml-2.5">
              <Icon name="caret-down" appearance={{ size: 'extraTiny' }} />
            </span>
          )}
        </button>
      )}
      {item.subMenu && (
        <div
          className={clsx(styles.subMenu, 'opacity-0 max-h-0', {
            'group-hover:opacity-100 group-hover:max-h-[9999px] sm:group-hover:pointer-events-auto': !isMobile,
            'max-h-[9999px] opacity-100': isOpen,
          })}
        >
          <SubMenu items={item.subMenu} />
        </div>
      )}
    </>
  );
};

const Nav: FC<NavProps> = ({ items }) => (
  <ul className="flex flex-col text-gray-700 sm:flex-row sm:gap-x-1">
    {items.map((item) => (
      <li key={item.key} className={item.subMenu && 'relative group'}>
        <NavItem {...{ item }} />
      </li>
    ))}
  </ul>
);

Nav.displayName = displayName;

export default Nav;
