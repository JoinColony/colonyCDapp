import React, { FC } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useController } from 'react-hook-form';
import RichText from '~v5/shared/RichText';
import { accordionAnimation } from '~constants/accordionAnimation';
import { DescriptionFieldProps } from './types';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';

const DescriptionField: FC<DescriptionFieldProps> = ({
  isDecriptionFieldExpanded,
  toggleOffDecriptionSelect,
  toggleOnDecriptionSelect,
  fieldName,
}) => {
  const {
    fieldState: { error },
  } = useController({ name: fieldName });
  const isError = !!error;
  const { readonly, isActionPending } = useAdditionalFormOptionsContext();

  return (
    <div className="sm:relative w-full">
      {!isDecriptionFieldExpanded && (
        <div
          className={clsx(
            'flex text-md transition-colors md:hover:text-blue-400 items-end',
            {
              'text-gray-400': !isError,
              'text-negative-400': isError,
            },
          )}
        >
          <RichText
            name={fieldName}
            isReadonly={readonly || isActionPending}
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
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <RichText
                name={fieldName}
                isReadonly={readonly || isActionPending}
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
};

export default DescriptionField;
