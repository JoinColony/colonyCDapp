import React, { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useTablet } from '~hooks';
import { accordionAnimation } from '~constants/accordionAnimation';

import NavigationSidebarButton from '../NavigationSidebarButton';
import NavigationSidebarSecondLevel from '../NavigationSidebarSecondLevel';
import NavigationSidebarThirdLevel from '../NavigationSidebarThirdLevel/NavigationSidebarThirdLevel';
import useNavigationSidebarContext from '../NavigationSidebarContext/hooks';
import { NavigationSidebarMainMenuProps } from './types';

const displayName =
  'v5.frame.NavigationSidebar.partials.NavigationSidebarMainMenu';

const NavigationSidebarMainMenu: FC<NavigationSidebarMainMenuProps> = ({
  mainMenuItems,
}) => {
  const isTablet = useTablet();
  const { openItemIndex, setOpenItemIndex, thirdLevelMenuToggle } =
    useNavigationSidebarContext();
  const [, { toggleOff: toggleOffThirdLevelMenu }] = thirdLevelMenuToggle;

  return (
    <ul className="flex flex-col gap-2 md:w-[2.625rem] md:overflow-visible">
      {mainMenuItems.map(
        (
          {
            key,
            iconName,
            label,
            secondLevelMenuProps,
            relatedActionsProps,
            onClick,
            hideMobile,
            className,
            isActive: isActiveProp,
          },
          index,
        ) => {
          // Don't show item if hideMobile is true and we're on mobile
          if (isTablet && hideMobile) {
            return null;
          }

          const isActive = index + 1 === openItemIndex;

          return (
            <li key={key}>
              <NavigationSidebarButton
                onClick={(e) => {
                  if (onClick) {
                    onClick(e);
                    setOpenItemIndex(undefined);
                    return;
                  }
                  setOpenItemIndex(isActive ? undefined : index + 1);
                  toggleOffThirdLevelMenu();
                }}
                isActive={isActive || isActiveProp}
                isExpanded={isActive}
                label={label}
                iconName={iconName}
                hasSecondLevel={!!secondLevelMenuProps}
                className={className}
              />
              <AnimatePresence>
                {isTablet && secondLevelMenuProps && isActive && (
                  <motion.div
                    variants={accordionAnimation}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="overflow-hidden"
                  >
                    <NavigationSidebarSecondLevel
                      {...secondLevelMenuProps}
                      additionalContent={
                        relatedActionsProps ? (
                          <div className="mt-4">
                            <NavigationSidebarThirdLevel
                              {...relatedActionsProps}
                            />
                          </div>
                        ) : undefined
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        },
      )}
    </ul>
  );
};

NavigationSidebarMainMenu.displayName = displayName;

export default NavigationSidebarMainMenu;
