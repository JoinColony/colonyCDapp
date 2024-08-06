import clsx from 'clsx';
import React from 'react';

import ColonyLogo from '~icons/ColonyLogo.tsx';
import FeedbackButton from '~shared/FeedbackButton/index.ts';

import ColonySwitcher from '../ColonySwitcher/index.ts';

import { type SidebarProps } from './types.ts';

const displayName = 'v5.shared.Navigation.Sidebar';

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      showColonySwitcher = true,
      showFeedbackButton = true,
      showColonyLogo = true,
      colonySwitcherProps,
      feedbackButtonProps,
      className,
      headerClassName,
      footerClassName,
      children,
    },
    ref,
  ) => {
    return (
      <nav
        ref={ref}
        className={clsx(
          'top-[calc(var(--header-nav-section-height)+var(--top-content-height))]',
          'z-sidebar hidden h-full w-fit flex-col items-center rounded-lg bg-gray-900 px-2 pb-4 pt-2 md:flex',
          className,
        )}
      >
        {showColonySwitcher && (
          <section className={clsx('flex w-full', headerClassName)}>
            <ColonySwitcher {...colonySwitcherProps} />
          </section>
        )}
        {children && <section className="w-full flex-1">{children}</section>}
        <section
          className={clsx(
            'flex w-full flex-1 flex-col items-center justify-end gap-[17px]',
            footerClassName,
          )}
        >
          {showFeedbackButton && <FeedbackButton {...feedbackButtonProps} />}
          {showColonyLogo && (
            <div className="px-2">
              <ColonyLogo />
            </div>
          )}
        </section>
      </nav>
    );
  },
);

Sidebar.displayName = displayName;

export default Sidebar;
