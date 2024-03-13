import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC, useState } from 'react';
import { useController } from 'react-hook-form';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import RichText from '~v5/shared/RichText/index.ts';

import { type DescriptionFieldProps } from './types.ts';

const DescriptionField: FC<DescriptionFieldProps> = ({
  isDecriptionFieldExpanded,
  toggleOffDecriptionSelect,
  toggleOnDecriptionSelect,
  fieldName,
  maxDescriptionLength,
  disabled,
}) => {
  const {
    fieldState: { error },
  } = useController({ name: fieldName });
  const isError = !!error;
  const { readonly } = useAdditionalFormOptionsContext();

  const [shouldFocus, setShouldFocus] = useState(false);

  return (
    <div className="w-full sm:relative">
      {!isDecriptionFieldExpanded && (
        <div
          className={clsx(
            'flex w-full items-end text-md transition-colors md:hover:text-blue-400',
            {
              'text-gray-400': !isError,
              'text-negative-400': isError,
            },
          )}
        >
          <RichText
            name={fieldName}
            isReadonly={readonly}
            isDisabled={disabled}
            isDecriptionFieldExpanded={isDecriptionFieldExpanded}
            maxDescriptionLength={maxDescriptionLength}
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
              onAnimationStart={() => {
                setShouldFocus(false);
              }}
              onAnimationComplete={() => {
                setShouldFocus(true);
              }}
            >
              <RichText
                name={fieldName}
                isReadonly={readonly}
                maxDescriptionLength={maxDescriptionLength}
                isDisabled={disabled}
                isDecriptionFieldExpanded={isDecriptionFieldExpanded}
                toggleOffDecriptionSelect={toggleOffDecriptionSelect}
                toggleOnDecriptionSelect={toggleOnDecriptionSelect}
                shouldFocus={shouldFocus}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default DescriptionField;
