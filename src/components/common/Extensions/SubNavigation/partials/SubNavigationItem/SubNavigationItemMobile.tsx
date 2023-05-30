import React, { PropsWithChildren, FC } from 'react';
import clsx from 'clsx';

import { AnimatePresence, motion } from 'framer-motion';
import Button from '~shared/Extensions/Button/Button';
import Icon from '~shared/Icon';

import { SubNavigationItemProps } from './types';

import styles from './SubNavigationItemMobile.module.css';
import { accordionAnimation } from '~constants/accordionAnimation';

const displayName = 'common.Extensions.SubNavigation.partials.SubNavigationItem.SubNavigationItemMobile';

const SubNavigationItemMobile: FC<PropsWithChildren<SubNavigationItemProps>> = ({
  label,
  content,
  isOpen,
  setOpen,
  icon,
}) => (
  <li>
    <Button onClick={setOpen} mode="textButton" className={clsx(styles.button, { [styles.activeButton]: isOpen })}>
      <span className="flex items-center">
        <Icon name={icon} appearance={{ size: 'small' }} />
        <span className="flex ml-2">{label}</span>
      </span>
      <span className={clsx('flex ml-2.5 transition-transform duration-normal', { 'rotate-180': isOpen })}>
        <Icon name="caret-down" appearance={{ size: 'extraTiny' }} />
      </span>
    </Button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="accordion-content"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={accordionAnimation}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className={styles.dropdownContent}>{content}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </li>
);

SubNavigationItemMobile.displayName = displayName;

export default SubNavigationItemMobile;
