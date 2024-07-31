import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { formatText } from '~utils/intl.ts';
import {
  sidebarButtonIconStyles,
  sidebarButtonStyles,
  sidebarButtonTextStyles,
} from '~v5/common/Navigation/consts.ts';
import { usePageLayoutContext } from '~v5/frame/PageLayout/context/PageLayoutContext.ts';
import Button from '~v5/shared/Button/Button.tsx';

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

  const handleOnClick = () => {
    if (isAccordion) {
      setIsAccordionExpanded((state) => !state);

      return;
    }

    if (path && routeType) {
      toggleSidebar();

      const pathPrefix = routeType === 'colony' ? `/${colony.name}/` : '/';

      const derivedPath = `${pathPrefix}${path}`;

      navigate(derivedPath);
    }
  };

  return (
    <div>
      <Button
        onClick={handleOnClick}
        className={clsx(sidebarButtonStyles, '!justify-between', {
          '!bg-gray-800': !!matchingRoute,
        })}
      >
        <div className="flex flex-row items-center gap-3">
          {Icon ? (
            <Icon className={sidebarButtonIconStyles} />
          ) : (
            <div className="w-5" />
          )}
          <p className={sidebarButtonTextStyles}>{formatText(translation)}</p>
        </div>
        {isAccordion && (
          <CaretDown
            className={clsx(
              sidebarButtonIconStyles,
              'h-[14px] transition-transform duration-200',
              {
                '-rotate-180': isAccordionExpanded,
              },
            )}
          />
        )}
      </Button>
      <AnimatePresence mode="wait">
        {isAccordionExpanded &&
          subItems?.map((subItem) => (
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
      </AnimatePresence>
    </div>
  );
};

NavigationSectionItem.displayName = displayName;

export default NavigationSectionItem;
