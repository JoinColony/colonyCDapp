import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import Icon from '~shared/Icon/Icon';
import { accordionAnimation } from '~constants/accordionAnimation';
import NestedOptions from '~v5/shared/SubNavigationItem/partials/NestedOptions';
import { AccordionItemProps } from '../types';

const displayName = 'v5.common.Filter.partials.AccordionItem';

const AccordionItem: FC<AccordionItemProps> = ({
  title,
  option,
  onSelectNestedOption,
  onSelectParentFilter,
  selectedChildOption,
}) => {
  const [clicked, setClicked] = useState(false);
  const { formatMessage } = useIntl();

  const handleToggle = () => {
    setClicked((prev) => !prev);
    onSelectParentFilter?.(option);
  };

  return (
    <li>
      <button
        className="flex justify-between items-center text-4 text-gray-400 uppercase w-full"
        onClick={handleToggle}
        type="button"
        aria-label={formatMessage({ id: 'select.filter.menu.item' })}
      >
        {formatMessage({ id: title })}
        <span
          className={clsx('text-gray-700', {
            'rotate-180': clicked,
          })}
        >
          <Icon
            appearance={{ size: 'extraTiny' }}
            name="caret-down"
            title={{ id: 'file-text' }}
          />
        </span>
      </button>

      <AnimatePresence>
        {clicked && (
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
              selectedParentOption={option}
              selectedChildOption={selectedChildOption}
              onChange={onSelectNestedOption}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

AccordionItem.displayName = displayName;

export default AccordionItem;
