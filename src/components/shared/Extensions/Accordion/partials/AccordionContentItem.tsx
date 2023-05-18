import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, useState } from 'react';
import { AccordionContentItemProps } from '../types';
import AccordionHeader from './AccordionHeader';
import { accordionAnimation } from '~constants/accordionAnimation';

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
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={accordionAnimation}
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
