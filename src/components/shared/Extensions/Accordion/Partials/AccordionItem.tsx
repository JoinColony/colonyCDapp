import React, { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AccordionItemProps } from './AccordtionItem.types';
import AccordionHeader from './AccordionHeader';

const displayName = 'Extensions.Accordion.Partials.AccordionItem';

const AccordionItem: FC<AccordionItemProps> = ({ title, content, isOpen, onClick }) => {
  return (
    <div>
      <div
        className="w-full text-gray-900 font-semibold text-md"
        onClick={onClick}
        onKeyUp={onClick}
        role="button"
        tabIndex={0}
      >
        <AccordionHeader title={title} />
      </div>
      <div className="relative">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="accordion-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div>{content}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

AccordionItem.displayName = displayName;

export default AccordionItem;
