import { AnimatePresence, motion } from 'framer-motion';
import React, { FC } from 'react';
import { AccordionContentItemProps } from '../types';
import AccordionHeader from './AccordionHeader';

const displayName = 'Extensions.Accordion.partials.AccordionContentItem';

const AccordionContentItem: FC<AccordionContentItemProps> = ({ accordionItem, isOpen, onClick }) => (
  <div className="relative">
    <div onClick={onClick} onKeyUp={onClick} role="button" tabIndex={0}>
      <AccordionHeader title={accordionItem?.header} isOpen={isOpen} />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div>{accordionItem?.content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

AccordionContentItem.displayName = displayName;

export default AccordionContentItem;
