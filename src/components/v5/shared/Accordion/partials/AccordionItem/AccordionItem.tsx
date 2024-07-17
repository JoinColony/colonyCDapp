import { ArrowDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC, type PropsWithChildren } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';

import { type AccordionItemProps } from './types.ts';

const displayName = 'v5.Accordion.partials.AccordionItem';

const AccordionItem: FC<PropsWithChildren<AccordionItemProps>> = ({
  title,
  icon: Icon = ArrowDown,
  iconSize = 12,
  isOpen,
  onToggle,
  className,
  children,
  withDelimiter,
}) => (
  <div className={clsx(className, 'w-full overflow-hidden')}>
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        `
          accordion-toggler
          md:hover:text-blue-500
          flex
          w-full
          items-center
          justify-between
          gap-4
          text-left
          transition-colors
        `,
        { 'text-blue-500': isOpen, 'border-b border-gray-200': withDelimiter },
      )}
    >
      {title}
      <span
        className={clsx(
          'accordion-icon flex flex-shrink-0 items-center transition-transform duration-[400ms] ease-out',
          {
            'text-blue-500 rotate-180': isOpen,
          },
        )}
      >
        <Icon size={iconSize} />
      </span>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="accordion-content"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={accordionAnimation}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="accordion-content"
        >
          <div>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

AccordionItem.displayName = displayName;

export default AccordionItem;
