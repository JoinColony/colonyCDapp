import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import noop from 'lodash/noop';
import React, { useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { formatText } from '~utils/intl.ts';
import {
  sidebarButtonClass,
  sidebarButtonIconClass,
  sidebarButtonTextClass,
} from '~v5/common/Navigation/sidebar.styles.ts';
import { usePageLayoutContext } from '~v5/frame/PageLayout/context/PageLayoutContext.ts';
import buttonClasses from '~v5/shared/Button/Button.styles.ts';

import { motionVariants } from './consts.ts';
import { type RouteSectionItemProps } from './types.ts';

const displayName =
  'v4.frame.NavigationSidebar.partials.NavigationSection.partials.NavigationItem';

const NavigationSectionItem: React.FC<RouteSectionItemProps> = ({
  subItems,
  translation,
  path,
  icon: Icon,
  routeType,
}) => {
  const { colony } = useColonyContext();

  const navigate = useNavigate();

  const matchingRoute = useMatch(`${colony.name}/${path}`);

  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);

  const { toggleSidebar } = usePageLayoutContext();

  const isAccordion = !!subItems;

  const onClick = () => {
    toggleSidebar();

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
    <div>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={noop}
        onClick={onClick}
        className={clsx(
          buttonClasses.primarySolid,
          sidebarButtonClass,
          'flex h-10 items-center !justify-between gap-3 rounded-lg',
          {
            '!bg-gray-800': !!matchingRoute && !isAccordion,
            '!pr-1': isAccordion,
          },
        )}
        aria-label={`${path} page`}
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
          <div
            onClick={onToggleAccordion}
            onKeyDown={noop}
            tabIndex={0}
            role="button"
            className="rounded-full p-2 transition-colors hover:bg-gray-900"
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
        )}
      </div>
      <AnimatePresence mode="wait">
        {isAccordionExpanded && (
          <div className="mt-0.5 flex w-full flex-col gap-0.5">
            {subItems?.map((subItem) => (
              <motion.div
                variants={motionVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                key={subItem.id}
              >
                <NavigationSectionItem {...subItem} />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

NavigationSectionItem.displayName = displayName;

export default NavigationSectionItem;
