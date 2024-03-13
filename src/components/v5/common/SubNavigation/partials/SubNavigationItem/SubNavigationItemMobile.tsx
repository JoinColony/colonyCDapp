import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type PropsWithChildren, type FC } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';

import { type SubNavigationItemProps } from './types.ts';

const displayName =
  'v5.common.SubNavigation.partials.SubNavigationItem.SubNavigationItemMobile';

const SubNavigationItemMobile: FC<
  PropsWithChildren<SubNavigationItemProps>
> = ({ label, content, isOpen, setOpen, icon: Icon }) => (
  <li>
    <button
      type="button"
      onClick={setOpen}
      className={clsx(
        'flex w-full items-center justify-between py-3 text-lg font-semibold text-gray-700 sm:w-auto sm:text-md sm:hover:text-blue-400',
        {
          'text-blue-400': isOpen,
        },
      )}
    >
      <span className="flex items-center">
        <span className="flex shrink-0">
          <Icon size={18} />
        </span>
        <span className="ml-2 flex">{label}</span>
      </span>
      <span
        className={clsx('ml-2.5 flex transition-transform duration-normal', {
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
          <div className="mb-3 rounded-md border border-gray-200 bg-base-white sm:mb-0">
            {content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </li>
);

SubNavigationItemMobile.displayName = displayName;

export default SubNavigationItemMobile;
