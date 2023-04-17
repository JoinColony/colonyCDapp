import { AnimatePresence, motion } from 'framer-motion';
import React, { FC } from 'react';
import { AccordionContentItemProps } from '../Accordion.types';

const displayName = 'Extensions.Accordion.Partials.AccordionContentItem';

const AccordionContentItem: FC<AccordionContentItemProps> = ({ accordionItem, isOpen, onClick }) => {
  return (
    <div className="relative">
      <div onClick={onClick} onKeyUp={onClick} role="button" tabIndex={0}>
        {accordionItem?.header}
        <div className="w-full bg-gray-200 h-[1px] mb-6" />
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
};

AccordionContentItem.displayName = displayName;

export default AccordionContentItem;
