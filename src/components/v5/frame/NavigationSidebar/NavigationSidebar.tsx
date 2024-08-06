import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC } from 'react';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import { useTablet } from '~hooks/index.ts';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import ColonyIcon from '~icons/ColonyIcon.tsx';
import ColonyLogo from '~images/logo-new.svg?react';
import FeedbackButton from '~shared/FeedbackButton/index.ts';
import ColonyAvatar from '~v5/shared/ColonyAvatar/index.ts';
import MobileColonyPageSidebarToggle from '~v5/shared/Navigation/Sidebar/partials/MobileColonyPageSidebarToggle/MobileColonyPageSidebarToggle.tsx';

import {
  secondLevelContentAnimation,
  secondLevelWrapperAnimation,
  thirdLevelWrapperAnimation,
} from './consts.ts';
import useNavigationSidebarContext from './partials/NavigationSidebarContext/hooks.ts';
import NavigationSidebarMainMenu from './partials/NavigationSidebarMainMenu/index.ts';
import NavigationSidebarMobileContentWrapper from './partials/NavigationSidebarMobileContentWrapper/index.ts';
import NavigationSidebarSecondLevel from './partials/NavigationSidebarSecondLevel/index.ts';
import NavigationSidebarThirdLevel from './partials/NavigationSidebarThirdLevel/index.ts';
import { type NavigationSidebarProps } from './types.ts';

const displayName = 'v5.frame.NavigationSidebarContent';

/**
 * @deprecated
 * Remove all components which are used exclusively for this component
 */
const NavigationSidebarContent: FC<NavigationSidebarProps> = ({
  className,
  mainMenuItems,
  colonySwitcherProps,
  additionalMobileContent,
  mobileBottomContent,
}) => {
  const isTablet = useTablet();
  const {
    openItemIndex,
    setOpenItemIndex,
    mobileMenuToggle,
    secondLevelMenuToggle,
    thirdLevelMenuToggle,
    setShouldShowThirdLevel,
  } = useNavigationSidebarContext();
  const [isMenuOpen, { toggle: toggleMenu, toggleOff: toggleOffMenu }] =
    mobileMenuToggle;
  const [isSecondLevelMenuOpen, { registerContainerRef }] =
    secondLevelMenuToggle;
  const [
    isThirdLevelMenuOpen,
    { toggleOn: toggleOnThirdLevelMenu, toggleOff: toggleOffThirdLevelMenu },
  ] = thirdLevelMenuToggle;
  const { isDarkMode } = usePageThemeContext();

  useDisableBodyScroll((isMenuOpen || openItemIndex === 0) && isTablet);

  const withMainMenu = !!mainMenuItems?.length;

  const activeMainMenuItem = openItemIndex
    ? mainMenuItems?.[openItemIndex - 1]
    : undefined;

  const hasThirdLevel = activeMainMenuItem?.relatedActionsProps?.items.length;

  const relatedActions = activeMainMenuItem?.relatedActionsProps;

  const mainMenu = withMainMenu ? (
    <NavigationSidebarMainMenu mainMenuItems={mainMenuItems} />
  ) : null;

  const handleArrowClick = () => {
    if (isThirdLevelMenuOpen) {
      toggleOffThirdLevelMenu();
      setShouldShowThirdLevel(false);
    } else {
      toggleOnThirdLevelMenu();
      setShouldShowThirdLevel(true);
    }
  };

  return (
    <nav
      className={clsx(
        className,
        `
          flex
          h-[5.625rem]
          border-b
          border-gray-200
          bg-base-white
          py-6
          md:h-full
          md:rounded-lg
          md:border
          md:py-0
        `,
        {
          'bg-gray-100': isDarkMode,
        },
      )}
      ref={registerContainerRef}
    >
      <div
        className={clsx('w-full md:h-full md:w-[5.125rem] md:p-4 md:pb-6', {
          'flex flex-col items-center justify-between gap-4': !isTablet,
          'inner h-full': isTablet,
        })}
      >
        <div
          className={`
            z-base
            flex
            h-full
            w-full
            items-center
            justify-between
            md:relative
            md:h-auto
            md:w-auto
            md:flex-col
            md:justify-start
            md:gap-9
          `}
        >
          <div className="flex gap-6 md:flex-col md:gap-9">
            <div className="flex justify-center md:w-full">
              <button
                type="button"
                onClick={() => {
                  if (openItemIndex === 0) {
                    setOpenItemIndex(undefined);
                  } else {
                    setOpenItemIndex(0);
                  }

                  if (isTablet) {
                    toggleOffMenu();
                  }

                  toggleOffThirdLevelMenu();
                }}
                className={clsx(
                  'rounded-full border-[.1875rem] transition-all sm:hover:border-blue-400',
                  {
                    'border-blue-400':
                      openItemIndex === 0 && isSecondLevelMenuOpen,
                    'border-transparent':
                      (!isTablet && openItemIndex !== 0) ||
                      (openItemIndex !== 0 && isTablet),
                  },
                )}
              >
                {colonySwitcherProps?.avatarProps ? (
                  <ColonyAvatar {...colonySwitcherProps.avatarProps} />
                ) : (
                  <div className="h-9 w-9">
                    <ColonyIcon size={36} />
                  </div>
                )}
              </button>
            </div>
            {isTablet ? (
              <>
                {withMainMenu && (
                  <>
                    <MobileColonyPageSidebarToggle
                      onClick={() => {
                        toggleMenu();
                        setOpenItemIndex(undefined);
                      }}
                      isOpen={isMenuOpen}
                      label={{ id: 'menu' }}
                    />
                    <NavigationSidebarMobileContentWrapper
                      mobileBottomContent={mobileBottomContent}
                      isOpen={isMenuOpen && openItemIndex !== 0}
                    >
                      {mainMenu}
                    </NavigationSidebarMobileContentWrapper>
                  </>
                )}
                <NavigationSidebarMobileContentWrapper
                  mobileBottomContent={mobileBottomContent}
                  isOpen={openItemIndex === 0}
                >
                  {colonySwitcherProps?.content.title && (
                    <NavigationSidebarSecondLevel
                      {...colonySwitcherProps?.content}
                    />
                  )}
                </NavigationSidebarMobileContentWrapper>
              </>
            ) : (
              mainMenu
            )}
          </div>
          {additionalMobileContent && isTablet && (
            <div>{additionalMobileContent}</div>
          )}
        </div>
        {!isTablet && (
          <>
            <div className="mt-auto flex w-11 justify-start px-px">
              <FeedbackButton
                onClick={() => {
                  if (openItemIndex === 0) {
                    setOpenItemIndex(undefined);
                  } else {
                    setOpenItemIndex(0);
                  }
                }}
              />
            </div>
            <ColonyLogo />
          </>
        )}
      </div>
      <AnimatePresence>
        {isSecondLevelMenuOpen && !isTablet && openItemIndex !== undefined && (
          <>
            <motion.div
              variants={secondLevelWrapperAnimation}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="h-full overflow-hidden"
            >
              <motion.div
                variants={secondLevelContentAnimation}
                className="h-full"
              >
                {openItemIndex &&
                activeMainMenuItem &&
                activeMainMenuItem?.secondLevelMenuProps ? (
                  <NavigationSidebarSecondLevel
                    {...activeMainMenuItem.secondLevelMenuProps}
                    onArrowClick={hasThirdLevel ? handleArrowClick : undefined}
                    isExpanded={hasThirdLevel ? isThirdLevelMenuOpen : false}
                  />
                ) : null}
                {openItemIndex === 0 && colonySwitcherProps?.content.title && (
                  <NavigationSidebarSecondLevel
                    {...colonySwitcherProps?.content}
                  />
                )}
              </motion.div>
            </motion.div>
            {hasThirdLevel && (
              <motion.div
                variants={thirdLevelWrapperAnimation}
                initial="hidden"
                exit="hidden"
                animate={isThirdLevelMenuOpen ? 'visible' : 'hidden'}
                className="absolute bottom-0 left-[calc(100%-.625rem)] top-0 -z-base h-full overflow-hidden"
              >
                <div
                  className={clsx(
                    'h-full overflow-auto rounded-r-lg pb-6 pl-9 pr-6 pt-[1.8125rem] text-base-white',
                    {
                      'bg-gray-50 text-gray-900': isDarkMode,
                      'bg-gray-900 text-base-white': !isDarkMode,
                    },
                  )}
                >
                  <NavigationSidebarThirdLevel
                    title={relatedActions?.title}
                    items={relatedActions?.items || []}
                  />
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

NavigationSidebarContent.displayName = displayName;

export default NavigationSidebarContent;
