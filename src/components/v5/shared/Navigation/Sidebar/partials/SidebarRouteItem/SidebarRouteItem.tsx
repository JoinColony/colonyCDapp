import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { noop } from 'lodash';
import React, { useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { useTablet } from '~hooks';
import { formatText } from '~utils/intl.ts';
import buttonClasses from '~v5/shared/Button/Button.styles.ts';
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
  routeType,
  subItems,
  onClick,
}) => {
  const { colony } = useColonyContext();

  const navigate = useNavigate();

  const matchingRoute = useMatch(`${colony.name}/${path}`);

  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);

  const { toggleTabletSidebar } = usePageLayoutContext();

  const isTablet = useTablet();

  const isAccordion = !!subItems;

  const handleClick = () => {
    onClick?.();

    if (isTablet) {
      toggleTabletSidebar();
    }

    const pathPrefix = routeType === 'colony' ? `/${colony.name}` : '';

    const derivedPath = `${pathPrefix}/${path}`;

    navigate(derivedPath);

    if (isAccordion) {
      setIsAccordionExpanded(true);
    }
  };

  const onToggleAccordion = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    setIsAccordionExpanded((state) => !state);
  };

  return (
    <>
      <div
        role="button"
        onClick={handleClick}
        onKeyDown={noop}
        tabIndex={0}
        className={clsx(buttonClasses.primarySolid, sidebarButtonClass, {
          '!bg-gray-800': !!matchingRoute && !isAccordion,
          '!pr-1': isAccordion,
        })}
        aria-label={`Go to the Colony ${path || 'Dashboard'} page`}
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
          <div className="flex w-full justify-end">
            <div
              onClick={onToggleAccordion}
              onKeyDown={noop}
              tabIndex={0}
              role="button"
              className="flex aspect-square h-[22px] items-center justify-center rounded-[4px] transition-colors hover:bg-gray-900"
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
            </div>
          </div>
        )}
      </div>
      <AnimatePresence presenceAffectsLayout>
        {isAccordionExpanded && (
          <motion.ul
            className="flex w-full flex-col gap-0.5 overflow-hidden"
            variants={motionVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            {subItems?.map((subItem) => (
              <SidebarRouteItem key={subItem.id} {...subItem} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
};

SidebarRouteItem.displayName = displayName;

export default SidebarRouteItem;
