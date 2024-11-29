import clsx from 'clsx';
import React from 'react';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import { dark, light } from '~frame/Extensions/themes/consts.ts';
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
      testId,
      children,
    },
    ref,
  ) => {
    const { isDarkMode } = usePageThemeContext();

    return (
      <nav
        ref={ref}
        className={clsx(
          'modal-blur top-[calc(var(--header-nav-section-height)+var(--top-content-height))]',
          'z-sidebar hidden h-full w-fit flex-col items-start rounded-lg bg-gray-900 px-2 pb-5 pt-[15.5px] md:flex',
          {
            '!bg-gray-100': isDarkMode,
          },
          className,
        )}
        data-testid={testId}
      >
        {showColonySwitcher && (
          <section
            className={clsx(
              'flex',
              { 'w-full': !colonySwitcherProps?.isLogoButton },
              headerClassName,
            )}
          >
            <ColonySwitcher {...colonySwitcherProps} />
          </section>
        )}
        {children && <section className="w-full flex-1">{children}</section>}
        <section
          className={clsx(
            'flex w-full flex-1 flex-col items-start justify-end gap-2',
            footerClassName,
          )}
        >
          {showFeedbackButton && <FeedbackButton {...feedbackButtonProps} />}
          {showColonyLogo && (
            <div className="px-2">
              <ColonyLogo color={isDarkMode ? dark.gray900 : light.baseWhite} />
            </div>
          )}
        </section>
      </nav>
    );
  },
);

Sidebar.displayName = displayName;

export default Sidebar;
