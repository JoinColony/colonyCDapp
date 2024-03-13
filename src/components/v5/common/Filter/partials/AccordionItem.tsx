import { CaretUp } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC, useState } from 'react';
import { useIntl } from 'react-intl';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import NestedOptions from '~v5/shared/SubNavigationItem/partials/NestedOptions.tsx';

import { type AccordionItemProps } from '../types.ts';

const displayName = 'v5.common.Filter.partials.AccordionItem';

const AccordionItem: FC<AccordionItemProps> = ({
  title,
  option,
  nestedFilters,
}) => {
  const [isOpened, setOpen] = useState(true);
  const { formatMessage } = useIntl();

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <li>
      <button
        className="group flex w-full items-center justify-between uppercase text-gray-400 text-4"
        onClick={handleToggle}
        type="button"
        aria-expanded={isOpened}
      >
        {formatMessage({ id: title })}
        <span
          className={clsx(
            'flex shrink-0 text-gray-700 transition-all duration-normal group-hover:text-blue-400',
            {
              'rotate-180': isOpened,
            },
          )}
        >
          <CaretUp size={16} />
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
