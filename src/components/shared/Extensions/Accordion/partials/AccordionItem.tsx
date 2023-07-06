import React, { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

import AccordionHeader from './AccordionHeader';
import AccordionContent from './AccordionContent';
import { AccordionItemProps } from '../types';
import { accordionAnimation } from '~constants/accordionAnimation';

const displayName = 'Extensions.Accordion.partials.AccordionItem';

const AccordionItem: FC<AccordionItemProps> = ({
  title,
  content,
  isOpen,
  onClick,
  errors,
  mode = 'primary',
}) => (
  <>
    <div
      className={clsx({
        'w-full text-2': mode === 'primary',
        'flex text-xs font-medium text-gray-400 uppercase justify-between w-full':
          mode === 'secondary',
      })}
      onClick={onClick}
      onKeyUp={onClick}
      role="button"
      tabIndex={0}
    >
      <AccordionHeader title={title} isOpen={isOpen} mode={mode} />
    </div>
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
            <AccordionContent content={content} errors={errors} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </>
);

AccordionItem.displayName = displayName;

export default AccordionItem;
