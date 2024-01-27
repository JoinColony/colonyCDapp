import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import Icon from '~shared/Icon/index.ts';
import NestedOptions from '~v5/shared/SubNavigationItem/partials/NestedOptions.tsx';

import { AccordionItemProps } from '../types.ts';

const displayName = 'v5.common.Filter.partials.AccordionItem';

const AccordionItem: FC<AccordionItemProps> = ({
  title,
  option,
  nestedFilters,
}) => {
  const [isOpened, setOpen] = useState(false);
  const { formatMessage } = useIntl();

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <li>
      <button
        className="flex justify-between items-center text-4 text-gray-400 uppercase w-full group"
        onClick={handleToggle}
        type="button"
        aria-expanded={isOpened}
      >
        {formatMessage({ id: title })}
        <span
          className={clsx(
            'flex shrink-0 text-gray-400 transition-all duration-normal group-hover:text-blue-400',
            {
              'rotate-180': isOpened,
            },
          )}
        >
          <Icon appearance={{ size: 'extraExtraTiny' }} name="caret-up" />
        </span>
      </button>

      <AnimatePresence>
        {isOpened && (
          <motion.div
            key="accordion-content"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={accordionAnimation}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <NestedOptions
              parentOption={option}
              nestedFilters={nestedFilters}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

AccordionItem.displayName = displayName;

export default AccordionItem;
