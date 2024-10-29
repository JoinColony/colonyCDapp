import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useLocation, useMatch, useParams } from 'react-router-dom';

import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import { useTablet } from '~hooks';
import { formatText } from '~utils/intl.ts';
import Link from '~v5/shared/Link/Link.tsx';
import {
  sidebarButtonClass,
  sidebarButtonIconClass,
  sidebarButtonTextClass,
} from '~v5/shared/Navigation/Sidebar/sidebar.styles';

import { motionVariants } from './consts.ts';
import { type SidebarRouteItemProps } from './types.ts';

const displayName = 'v5.shared.Navigation.Sidebar.partials.SidebarRouteItem';

const SidebarRouteItem: React.FC<SidebarRouteItemProps> = ({
  path,
  translation,
  icon: Icon,
  subItems,
  onClick,
  isColonyRoute,
}) => {
  const { colonyName } = useParams();

  const location = useLocation();

  const derivedPath = isColonyRoute
    ? `/${colonyName}${path ? `/${path}` : ''}`
    : `${path}`;
  const { isDarkMode } = usePageThemeContext();

  const matchingRoute = useMatch(derivedPath);

  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);

  const { toggleTabletSidebar } = usePageLayoutContext();

  const isTablet = useTablet();

  const isAccordion = !!subItems;

  const toggleAccordion = () => {
    setIsAccordionExpanded((state) => !state);
  };

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.();

    if (isAccordion) {
      if (isTablet) {
        event.preventDefault();

        toggleAccordion();

        return;
      }
      setIsAccordionExpanded(true);
    } else {
      toggleTabletSidebar();
    }
  };

  useEffect(() => {
    // I don't want to overly complicate this for now.
    // In the future, if we ever end up having multiple levels of route nesting,
    // adjust this accordingly via a recursive approach.
    if (
      isAccordion &&
      subItems
        .map((subItem) => subItem.path)
        .find((subItemPath) => location.pathname.endsWith(subItemPath))
    ) {
      setIsAccordionExpanded(true);
    }
  }, [isAccordion, location.pathname, matchingRoute, subItems]);

  const shouldHighlightItem = !!matchingRoute && !isAccordion;

  return (
    <>
      <div className="group relative flex flex-row items-center">
        <Link
          to={derivedPath}
          onClick={handleClick}
          aria-label={`Go to the Colony ${path || 'Dashboard'} page`}
          className={clsx(sidebarButtonClass, 'w-full', {
            '!bg-gray-100 md:!bg-gray-800': shouldHighlightItem && !isDarkMode,
            '!bg-gray-100': shouldHighlightItem && !isDarkMode,
            '!bg-gray-50': shouldHighlightItem && isDarkMode,
            'group-hover:!bg-gray-50 md:!bg-gray-100':
              !shouldHighlightItem && isDarkMode,
            '!pr-1': isAccordion,
          })}
        >
          <div className="flex flex-row items-center gap-3">
            {Icon ? (
              <Icon
                className={clsx(sidebarButtonIconClass, {
                  '!text-gray-900': isDarkMode,
                })}
              />
            ) : (
              <div className="w-5" />
            )}
            <p
              className={clsx(sidebarButtonTextClass, {
                '!text-gray-900': isDarkMode,
              })}
            >
              {formatText(translation)}
            </p>
          </div>
        </Link>
        {isAccordion && (
          <div className="pointer-events-none absolute right-2 md:pointer-events-auto">
            <button
              type="button"
              onClick={toggleAccordion}
              className={clsx(
                'flex aspect-square items-center justify-center rounded p-1 transition-colors hover:bg-base-white md:hover:bg-gray-900',
                {
                  'hover:!bg-gray-100': isDarkMode,
                },
              )}
            >
              <CaretDown
                className={clsx(
                  sidebarButtonIconClass,
                  'h-[14px] transition-transform duration-200',
                  {
                    '-rotate-180': isAccordionExpanded,
                    '!text-gray-900': isDarkMode,
                  },
                )}
              />
            </button>
          </div>
        )}
      </div>
      <AnimatePresence initial={false} presenceAffectsLayout>
        {isAccordionExpanded && (
          <motion.ul
            className="flex w-full flex-col overflow-hidden md:gap-0.5"
            variants={motionVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            {subItems?.map(
              ({ isColonyRoute: isSubItemColonyRoute, ...subItem }) => (
                <SidebarRouteItem
                  key={`sidebar-${subItem.translation.id}`}
                  isColonyRoute={isSubItemColonyRoute}
                  {...subItem}
                />
              ),
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
};

SidebarRouteItem.displayName = displayName;

export default SidebarRouteItem;
