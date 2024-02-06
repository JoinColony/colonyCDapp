import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type PropsWithChildren, type FC } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';

import { type SubNavigationItemProps } from './types.ts';

import styles from './SubNavigationItemMobile.module.css';

const displayName =
  'v5.common.SubNavigation.partials.SubNavigationItem.SubNavigationItemMobile';

const SubNavigationItemMobile: FC<
  PropsWithChildren<SubNavigationItemProps>
> = ({ label, content, isOpen, setOpen, icon: Icon }) => (
  <li>
    <button
      type="button"
      onClick={setOpen}
      className={clsx(styles.button, {
        [styles.activeButton]: isOpen,
      })}
    >
      <span className="flex items-center">
        <span className="flex shrink-0">
          <Icon size={18} />
        </span>
        <span className="flex ml-2">{label}</span>
      </span>
      <span
        className={clsx('flex ml-2.5 transition-transform duration-normal', {
          'rotate-180': isOpen,
        })}
      >
        <CaretDown size={12} />
      </span>
    </button>
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
