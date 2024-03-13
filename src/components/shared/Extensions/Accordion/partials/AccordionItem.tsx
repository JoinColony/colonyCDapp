import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';

import { type AccordionItemProps } from '../types.ts';

import AccordionContent from './AccordionContent.tsx';
import AccordionHeader from './AccordionHeader.tsx';

const displayName = 'Extensions.Accordion.partials.AccordionItem';

const AccordionItem: FC<AccordionItemProps> = ({
  title,
  content,
  isOpen,
  onClick,
  onInputChange,
}) => (
  <div className="mb-4 w-full last:mb-0">
    <AccordionHeader
      onClick={onClick}
      onKeyUp={onClick}
      role="button"
      tabIndex={0}
      title={title}
      isOpen={isOpen}
    />
    <div className="relative">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="accordion-content"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={accordionAnimation}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <AccordionContent content={content} onInputChange={onInputChange} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

AccordionItem.displayName = displayName;

export default AccordionItem;
