import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useMatch, useParams } from 'react-router-dom';

import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
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

  const derivedPath = isColonyRoute
    ? `/${colonyName}${path ? `/${path}` : ''}`
    : `${path}`;

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

  return (
    <>
      <Link
        to={derivedPath}
        onClick={handleClick}
        aria-label={`Go to the Colony ${path || 'Dashboard'} page`}
        className={clsx(sidebarButtonClass, {
          '!bg-gray-100 md:!bg-gray-800': !!matchingRoute && !isAccordion,
          '!pr-1': isAccordion,
        })}
      >
        <div className="flex flex-row items-center gap-3">
          {Icon ? (
            <Icon className={sidebarButtonIconClass} />
          ) : (
            <div className="w-5" />
          )}
          <p className={sidebarButtonTextClass}>{formatText(translation)}</p>
        </div>
        {isAccordion && (
          <div className="pointer-events-none flex w-full justify-end pr-1.5 md:pointer-events-auto md:pr-[1px]">
            <button
              type="button"
              onClick={toggleAccordion}
              className="flex aspect-square items-center justify-center rounded p-1 transition-colors hover:bg-base-white md:hover:bg-gray-900"
            >
              <CaretDown
                className={clsx(
                  sidebarButtonIconClass,
                  'h-[14px] transition-transform duration-200',
                  {
                    '-rotate-180': isAccordionExpanded,
                  },
                )}
              />
            </button>
          </div>
        )}
      </Link>
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
