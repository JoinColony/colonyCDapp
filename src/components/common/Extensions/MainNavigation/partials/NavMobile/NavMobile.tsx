import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { accordionAnimation } from '~constants/accordionAnimation';
import Icon from '~shared/Extensions/Icon';
import SubMenu from '../SubMenu';
import { NavItemMobileProps } from '../types';
import styles from '../Nav.module.css';

const displayName = 'common.Extensions.MainNavigation.partials.NavMobile';

const NavMobile: FC<NavItemMobileProps> = ({ item, isOpen, toggleItem }) => {
  const { formatMessage } = useIntl();

  return (
    <>
      {item.href ? (
        <a className={styles.navLink} href={item.href}>
          {formatMessage({
            id: `mainNavItem.${item.label}`,
            defaultMessage: `${item.label}`,
          })}
        </a>
      ) : (
        <button type="button" className={clsx(styles.navLink, { 'text-blue-400': isOpen })} onClick={toggleItem}>
          {formatMessage({
            id: `mainNavItem.${item.label}`,
            defaultMessage: `${item.label}`,
          })}
          {item.subMenu && (
            <span className={clsx('flex ml-2.5 transition-transform duration-normal', { 'rotate-180': isOpen })}>
              <Icon name="caret-down" appearance={{ size: 'extraTiny' }} />
            </span>
          )}
        </button>
      )}
      {item.subMenu && (
        <div className={styles.subMenuMobile}>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="accordion-content"
                initial="hidden"
                animate="visible"
                variants={accordionAnimation}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <SubMenu items={item.subMenu} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

NavMobile.displayName = displayName;

export default NavMobile;
