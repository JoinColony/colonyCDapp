import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useMobile } from '~hooks/index.ts';
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
  const isMobile = useMobile();
  const [isOpen, { toggle }] = useToggle();
  const { mobileMenuToggle, setOpenItemIndex } = useNavigationSidebarContext();
  const [, { toggleOff: toggleOffMenu }] = mobileMenuToggle;

  if (!items.length) {
    throw new Error('NavigationSidebarThirdLevel: items are required');
  }

  const ctaClassName =
    'text-md sm:text-3 text-inherit transition-colors sm:enabled:hover:underline block w-full text-left py-2 sm:whitespace-nowrap disabled:opacity-50';

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
                toggleOffMenu();
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
        sm:text-inherit
        rounded-[.25rem]
        bg-gray-900
        px-4
        py-2 text-base-white
        sm:rounded-none
        sm:bg-transparent
        sm:p-0
      `}
    >
      {title && !isMobile && (
        <motion.h3
          variants={thirdLevelContentAnimation}
          className="text-inherit mb-4 text-4 sm:whitespace-nowrap sm:uppercase"
        >
          {title}
        </motion.h3>
      )}
      {title && isMobile && (
        <button
          type="button"
          className="text-inherit flex w-full items-center justify-between gap-4 py-2 text-2"
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
        {isMobile && isOpen && (
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
      {!isMobile && list}
    </div>
  );
};

NavigationSidebarThirdLevel.displayName = displayName;

export default NavigationSidebarThirdLevel;
