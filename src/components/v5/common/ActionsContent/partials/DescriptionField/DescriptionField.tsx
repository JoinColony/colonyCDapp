import React, { FC } from 'react';
import clsx from 'clsx';

import { AnimatePresence, motion } from 'framer-motion';
import RichText from '~v5/shared/RichText';
import { accordionAnimation } from '~constants/accordionAnimation';
import { DescriptionFieldProps } from './types';

const DescriptionField: FC<DescriptionFieldProps> = ({
  isDecriptionFieldExpanded,
  toggleOffDecriptionSelect,
  toggleOnDecriptionSelect,
  isErrors,
}) => (
  <div className="sm:relative w-full">
    {!isDecriptionFieldExpanded && (
      <div
        className={clsx('flex text-md transition-colors hover:text-blue-400', {
          'text-negative-400': isErrors,
          'text-gray-600': !isErrors,
        })}
      >
        <RichText
          name="annotation"
          isDecriptionFieldExpanded={isDecriptionFieldExpanded}
          toggleOffDecriptionSelect={toggleOffDecriptionSelect}
          toggleOnDecriptionSelect={toggleOnDecriptionSelect}
        />
      </div>
    )}

    {isDecriptionFieldExpanded && (
      <AnimatePresence>
        {isDecriptionFieldExpanded && (
          <motion.div
            key="richeditor-content"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={accordionAnimation}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <RichText
              name="annotation"
              isDecriptionFieldExpanded={isDecriptionFieldExpanded}
              toggleOffDecriptionSelect={toggleOffDecriptionSelect}
              toggleOnDecriptionSelect={toggleOnDecriptionSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    )}
  </div>
);

export default DescriptionField;
