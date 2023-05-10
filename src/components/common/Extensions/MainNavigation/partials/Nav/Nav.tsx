import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { NavItemProps, NavProps } from './types';
import { useMobile } from '~hooks';
import Icon from '~shared/Icon';
import styles from './Nav.module.css';
import SubMenu from '../SubMenu';

const displayName = 'common.Extensions.MainNavigation.partials.Nav';

const NavItem: FC<NavItemProps> = ({ item }) => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();

  const NavElement = item.isLink ? (
    <>
      {isMobile ? (
        <a href={item.href} className="flex font-semibold text-lg text-gray-700 py-3 sm:text-md">
          {item.label}
          {item.subMenu && <Icon name="caret-down" appearance={{ size: 'extraTiny' }} />}
        </a>
      ) : (
        <>
          <a href={item.href} className={styles.navLink}>
            {item.label}
          </a>
          {item.subMenu && (
            <button type="button" onClick={() => 'click'}>
              <Icon name="caret-down" appearance={{ size: 'extraTiny' }} />
            </button>
          )}
        </>
      )}
    </>
  ) : (
    <>
      {isMobile ? (
        <button type="button" className="flex items-center py-3 text-lg">
          <span className="font-semibold text-lg text-gray-900 block mr-2.5 sm:text-md">{item.label}</span>
          {item.subMenu && <Icon name="caret-down" appearance={{ size: 'extraTiny' }} />}
        </button>
      ) : (
        <button
          type="button"
          className={clsx(styles.navLink)}
          aria-label={`${formatMessage({ id: 'ariaLabel.open' })} ${formatMessage({
            id: `navItem.${item.key}`,
            defaultMessage: `${item.label}`,
          })}`}
        >
          <span className="font-semibold text-lg text-gray-900 block mr-2.5 sm:text-md">{item.label}</span>
          {item.subMenu && <Icon name="caret-down" appearance={{ size: 'extraTiny' }} />}
        </button>
      )}
    </>
  );

  return (
    <>
      {NavElement}
      {item.subMenu && (
        <div
          className={clsx(
            styles.subMenu,
            'group-hover:opacity-100 group-hover:max-h-[9999px] group-hover:pointer-events-auto',
          )}
        >
          <SubMenu items={item.subMenu} />
        </div>
      )}
    </>
  );
};

const Nav: FC<NavProps> = ({ items }) => (
  <ul className="flex flex-col sm:flex-row sm:gap-x-1">
    {items.map((item) => (
      <li key={item.key} className={item.subMenu && 'relative group'}>
        <NavItem {...{ item }} />
      </li>
    ))}
  </ul>
);

Nav.displayName = displayName;

export default Nav;
