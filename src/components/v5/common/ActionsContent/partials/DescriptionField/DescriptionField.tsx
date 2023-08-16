import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

// import styles from '../../ActionsContent.module.css';
import RichText from '~v5/shared/RichText';
import { AnimatePresence, motion } from 'framer-motion';
import { accordionAnimation } from '~constants/accordionAnimation';
import { DescriptionFieldProps } from './types';

const DescriptionField: FC<DescriptionFieldProps> = ({
  isDecriptionFieldExpanded,
  toggleOffDecriptionSelect,
  toggleOnDecriptionSelect,
}) => {
  const { register } = useFormContext();
  // const [selectedDecisionMethod, setSelectedDecisionMethod] = useState<
  //   string | null
  // >('');

  return (
    <div className="sm:relative w-full">
      {!isDecriptionFieldExpanded && (
        <div className="flex text-md text-gray-600 transition-colors hover:text-blue-400">
          <RichText
            isDecriptionFieldExpanded={isDecriptionFieldExpanded}
            toggleOffDecriptionSelect={toggleOffDecriptionSelect}
            toggleOnDecriptionSelect={toggleOnDecriptionSelect}
          />
        </div>
      )}
      <input
        type="text"
        {...register('decisionMethod')}
        name="decisionMethod"
        id="decisionMethod"
        className="hidden"
        value={''}
      />

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
