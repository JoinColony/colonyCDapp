import React, { FC } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { isEmpty } from 'lodash';

import { useTablet } from '~hooks';
import ColonyAvatar from '~v5/shared/ColonyAvatar';
import HamburgerButton from '~v5/shared/HamburgerButton';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll';
import FeedbackButton from '~shared/FeedbackButton';
import ColonyLogo from '~images/logo-new.svg';
import Icon from '~shared/Icon';

import NavigationSidebarSecondLevel from './partials/NavigationSidebarSecondLevel';
import NavigationSidebarThirdLevel from './partials/NavigationSidebarThirdLevel';
import NavigationSidebarMainMenu from './partials/NavigationSidebarMainMenu';
import useNavigationSidebarContext from './partials/NavigationSidebarContext/hooks';
import NavigationSidebarMobileContentWrapper from './partials/NavigationSidebarMobileContentWrapper';
import { NavigationSidebarProps } from './types';
import {
  secondLevelContentAnimation,
  secondLevelWrapperAnimation,
  thirdLevelWrapperAnimation,
} from './consts';

const displayName = 'v5.frame.NavigationSidebarContent';

const NavigationSidebarContent: FC<NavigationSidebarProps> = ({
  className,
  mainMenuItems,
  colonySwitcherProps,
  additionalMobileContent,
  mobileBottomContent,
  hamburgerLabel,
}) => {
  const isTablet = useTablet();
  const {
    openItemIndex,
    setOpenItemIndex,
    mobileMenuToggle,
    secondLevelMenuToggle,
    thirdLevelMenuToggle,
  } = useNavigationSidebarContext();
  const [isMenuOpen, { toggle: toggleMenu, toggleOff: toggleOffMenu }] =
    mobileMenuToggle;
  const [isSecondLevelMenuOpen, { registerContainerRef }] =
    secondLevelMenuToggle;
  const [
    isThirdLevelMenuOpen,
    { toggle: toggleThirdLevelMenu, toggleOff: toggleOffThirdLevelMenu },
  ] = thirdLevelMenuToggle;

  useDisableBodyScroll((isMenuOpen || openItemIndex === 0) && isTablet);

  const withMainMenu = !!mainMenuItems?.length;

  const activeMainMenuItem = openItemIndex
    ? mainMenuItems?.[openItemIndex - 1]
    : undefined;

  const hasThirdLevel = activeMainMenuItem?.relatedActionsProps?.items.length;

  const relatedActions = activeMainMenuItem?.relatedActionsProps;

  const {
    avatarProps: colonySwitcherAvatarProps,
    content: colonySwitcherContent,
  } = colonySwitcherProps;

  const mainMenu = withMainMenu ? (
    <NavigationSidebarMainMenu mainMenuItems={mainMenuItems} />
  ) : null;

  return (
    <nav
      className={clsx(
        className,
        `
          py-6
          md:py-0
          h-[5.625rem]
          md:h-full
          md:rounded-lg
          bg-base-white
          border-b
          md:border
          border-gray-200
          flex
        `,
      )}
      ref={registerContainerRef}
    >
      <div
        className={clsx('md:h-full md:p-4 md:pb-6 w-full md:w-[5.125rem]', {
          'flex flex-col items-center gap-4 justify-between': !isTablet,
          'inner h-full': isTablet,
        })}
      >
        <div
          className={`
            w-full
            md:w-auto
            h-full
            md:h-auto
            flex
            items-center
            justify-between
            md:justify-start
            md:flex-col
            md:gap-9
            md:relative
            z-[1]
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
                {!isEmpty(colonySwitcherAvatarProps) ? (
                  <ColonyAvatar {...colonySwitcherAvatarProps} />
                ) : (
                  <div className="w-9 h-9">
                    <Icon
                      name="colony-icon"
                      appearance={{ size: 'largeSmall' }}
                    />
                  </div>
                )}
              </button>
            </div>
            {isTablet ? (
              <>
                {withMainMenu && (
                  <>
                    <HamburgerButton
                      onClick={() => {
                        toggleMenu();
                        setOpenItemIndex(undefined);
                      }}
                      isOpen={isMenuOpen}
                      label={hamburgerLabel}
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
                  <NavigationSidebarSecondLevel {...colonySwitcherContent} />
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
            <div className="w-11 px-px mt-auto flex justify-start">
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
                    onArrowClick={
                      hasThirdLevel ? toggleThirdLevelMenu : undefined
                    }
                    isExpanded={hasThirdLevel ? isThirdLevelMenuOpen : false}
                  />
                ) : null}
                {openItemIndex === 0 && (
                  <NavigationSidebarSecondLevel {...colonySwitcherContent} />
                )}
              </motion.div>
            </motion.div>
            {hasThirdLevel && (
              <motion.div
                variants={thirdLevelWrapperAnimation}
                initial="hidden"
                exit="hidden"
                animate={isThirdLevelMenuOpen ? 'visible' : 'hidden'}
                className="absolute top-0 bottom-0 h-full left-[calc(100%-.625rem)] -z-[1] overflow-hidden"
              >
                <div className="pb-6 pr-6 pl-9 pt-[1.8125rem] bg-gray-900 text-white rounded-r-lg h-full overflow-auto">
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
