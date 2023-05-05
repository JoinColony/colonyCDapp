import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, useState } from 'react';
import { AccordionContentItemProps } from '../types';
import AccordionHeader from './AccordionHeader';

const displayName = 'Extensions.Accordion.partials.AccordionContentItem';

const AccordionContentItem: FC<AccordionContentItemProps> = ({ accordionItem }) => {
  const [visibility, setVisibility] = useState(false);

  const onOpenIndexChange = () => {
    setVisibility(!visibility);
  };

  return (
    <div className="relative">
      <div onClick={onOpenIndexChange} onKeyUp={onOpenIndexChange} role="button" tabIndex={0}>
        <AccordionHeader title={accordionItem?.header} isOpen={visibility} />
        <AnimatePresence>
          {visibility && (
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
