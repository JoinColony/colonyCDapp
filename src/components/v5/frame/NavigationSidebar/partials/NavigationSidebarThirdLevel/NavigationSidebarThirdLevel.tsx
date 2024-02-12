import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useTablet } from '~hooks/index.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Link from '~v5/shared/Link/index.ts';

import { thirdLevelContentAnimation } from '../../consts.ts';
import useNavigationSidebarContext from '../NavigationSidebarContext/hooks.ts';

import { type NavigationSidebarThirdLevelProps } from './types.ts';

const displayName =
  'v5.frame.NavigationSidebar.partials.NavigationSidebarThirdLevel';

const NavigationSidebarThirdLevel: FC<NavigationSidebarThirdLevelProps> = ({
  title,
  items,
}) => {
  const isTablet = useTablet();
  const [isOpen, { toggle }] = useToggle();
  const { setOpenItemIndex } = useNavigationSidebarContext();

  if (!items.length) {
    throw new Error('NavigationSidebarThirdLevel: items are required');
  }

  const ctaClassName =
    'text-md md:text-3 text-inherit transition-colors md:enabled:hover:underline block w-full text-left py-2 md:whitespace-nowrap disabled:opacity-50';

  const list = (
    <ul className="flex flex-col gap-0.5">
      {items.map(({ key, label, href, onClick, ...item }) => (
        <motion.li variants={thirdLevelContentAnimation} key={key}>
          {href ? (
            <Link to={href} className={ctaClassName}>
              {label}
            </Link>
          ) : (
            <button
              type="button"
              className={ctaClassName}
              onClick={(e) => {
                setOpenItemIndex(undefined);
                onClick?.(e);
              }}
              {...item}
            >
              {label}
            </button>
          )}
        </motion.li>
      ))}
    </ul>
  );

  return (
    <div
      className={`
        bg-gray-900
        text-base-white
        md:bg-transparent
        md:text-inherit
        px-4 py-2
        md:p-0
        rounded-[.25rem]
        md:rounded-none
      `}
    >
      {title && !isTablet && (
        <motion.h3
          variants={thirdLevelContentAnimation}
          className="mb-4 text-4 md:uppercase text-inherit md:whitespace-nowrap"
        >
          {title}
        </motion.h3>
      )}
      {title && isTablet && (
        <button
          type="button"
          className="text-inherit flex justify-between items-center gap-4 w-full text-2 py-2"
          onClick={toggle}
        >
          {title}
          <CaretDown
            size={12}
            className={clsx('transition-transform', {
              'rotate-180': isOpen,
            })}
          />
        </button>
      )}
      <AnimatePresence>
        {isTablet && isOpen && (
          <motion.div
            variants={accordionAnimation}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="overflow-hidden"
          >
            {list}
          </motion.div>
        )}
      </AnimatePresence>
      {!isTablet && list}
    </div>
  );
};

NavigationSidebarThirdLevel.displayName = displayName;

export default NavigationSidebarThirdLevel;
