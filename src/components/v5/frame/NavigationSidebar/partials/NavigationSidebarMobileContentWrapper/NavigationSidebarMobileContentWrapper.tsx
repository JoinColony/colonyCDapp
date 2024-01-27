import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { FC, PropsWithChildren } from 'react';

import NavigationFeedbackWidget from '../NavigationFeedbackWidget/index.ts';

import { mobileWrapperAnimation } from './consts.ts';
import { NavigationSidebarMobileContentWrapperProps } from './types.ts';

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
        top-full
        left-0
        right-0
        w-full
        h-[calc(100vh-var(--top-content-height))]
        bg-base-white
        overflow-hidden
      `,
      {
        'z-[1]': isOpen,
      },
    )}
  >
    <div className="inner pt-4 pb-6 !px-4 h-full flex flex-col gap-6">
      <div className="flex-grow overflow-auto">{children}</div>
      <NavigationFeedbackWidget />
      {mobileBottomContent && (
        <div className="flex-shrink-0 pt-6 border-t border-t-gray-200">
          {mobileBottomContent}
        </div>
      )}
    </div>
  </motion.div>
);

NavigationSidebarMobileContentWrapper.displayName = displayName;

export default NavigationSidebarMobileContentWrapper;
