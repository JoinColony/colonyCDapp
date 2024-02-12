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
}) => (
  <div className={clsx(className, 'w-full overflow-hidden')}>
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        `
          accordion-toggler
          w-full
          flex
          items-center
          justify-between
          text-left
          gap-4
          transition-colors
          md:hover:text-blue-500
        `,
        { 'text-blue-500': isOpen },
      )}
    >
      {title}
      <span
        className={clsx(
          'accordion-icon flex items-center flex-shrink-0 transition-transform duration-[400ms] ease-out',
          {
            'rotate-180 text-blue-500': isOpen,
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
