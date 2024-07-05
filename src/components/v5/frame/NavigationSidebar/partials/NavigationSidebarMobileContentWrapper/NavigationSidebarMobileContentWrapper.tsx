import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { type FC, type PropsWithChildren } from 'react';

import NavigationFeedbackWidget from '../NavigationFeedbackWidget/index.ts';

import { mobileWrapperAnimation } from './consts.ts';
import { type NavigationSidebarMobileContentWrapperProps } from './types.ts';

const displayName =
  'v5.frame.NavigationSidebar.partials.NavigationSidebarMobileContentWrapper';

const NavigationSidebarMobileContentWrapper: FC<
  PropsWithChildren<NavigationSidebarMobileContentWrapperProps>
> = ({ children, mobileBottomContent, isOpen }) => (
  <motion.div
    variants={mobileWrapperAnimation}
    initial="hidden"
    animate={isOpen ? 'visible' : 'hidden'}
    transition={{
      ease: 'easeInOut',
    }}
    className={clsx(
      `
        absolute
        left-0
        right-0
        top-full
        z-base
        h-[calc(100vh-var(--top-content-height))]
        w-full
        overflow-hidden
        bg-base-white
      `,
    )}
  >
    <div className="inner flex h-full flex-col gap-6 !p-6">
      <div className="flex-grow overflow-y-auto overflow-x-hidden">
        {children}
      </div>
      <NavigationFeedbackWidget />
      {mobileBottomContent && (
        <div className="flex-shrink-0 border-t border-t-gray-200 pt-6">
          {mobileBottomContent}
        </div>
      )}
    </div>
  </motion.div>
);

NavigationSidebarMobileContentWrapper.displayName = displayName;

export default NavigationSidebarMobileContentWrapper;
