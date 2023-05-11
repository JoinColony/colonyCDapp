import React, { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AccordionHeader from './AccordionHeader';
import AccordionContent from './AccordionContent';
import { AccordionItemProps } from '../types';
import { accordionAnimation } from '~constants/accordionAnimation';

const displayName = 'Extensions.Accordion.partials.AccordionItem';

const AccordionItem: FC<AccordionItemProps> = ({ title, content, isOpen, onClick }) => (
  <>
    <div
      className="w-full text-gray-900 font-semibold text-md"
      onClick={onClick}
      onKeyUp={onClick}
      role="button"
      tabIndex={0}
    >
      <AccordionHeader title={title} isOpen={isOpen} />
    </div>
    <div className="relative">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="accordion-content"
            initial="hidden"
            animate="visible"
            variants={accordionAnimation}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <AccordionContent content={content} isOpen={isOpen} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </>
);

AccordionItem.displayName = displayName;

export default AccordionItem;
