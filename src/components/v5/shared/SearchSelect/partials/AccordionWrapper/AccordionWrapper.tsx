import { CaretUp, CaretDown } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { type FC, type PropsWithChildren } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';

interface AccordionWrapperProps extends PropsWithChildren {
  title: React.ReactNode;
  onClick: () => void;
  isOpen?: boolean;
}

export const AccordionWrapper: FC<AccordionWrapperProps> = ({
  title,
  children,
  onClick,
  isOpen,
}) => {
  return (
    <div className="mb-[0.625rem] last:mb-0">
      <div className="flex items-center justify-between px-2">
        {title}
        <button
          type="button"
          className="flex h-4 w-4 items-end justify-center text-gray-700"
          onClick={onClick}
        >
          <span className="text-gray-700 md:hover:text-blue-400">
            {isOpen ? <CaretUp size={12} /> : <CaretDown size={12} />}
          </span>
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={accordionAnimation}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
