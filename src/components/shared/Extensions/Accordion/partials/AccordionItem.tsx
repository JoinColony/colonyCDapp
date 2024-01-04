import { AnimatePresence, motion } from 'framer-motion';
import React, { FC } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation';

import { AccordionItemProps } from '../types';

import AccordionContent from './AccordionContent';
import AccordionHeader from './AccordionHeader';

const displayName = 'Extensions.Accordion.partials.AccordionItem';

const AccordionItem: FC<AccordionItemProps> = ({
  title,
  content,
  isOpen,
  onClick,
  onInputChange,
}) => (
  <div className="w-full mb-4 last:mb-0">
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
