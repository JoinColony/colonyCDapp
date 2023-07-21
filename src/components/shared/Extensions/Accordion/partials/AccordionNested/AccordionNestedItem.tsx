import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import { AccordionNestedItemProps } from '../../types';
import { accordionAnimation } from '~constants/accordionAnimation';
import AccordionHeaderItem from './AccordionNestedHeader';

const displayName =
  'Extensions.Accordion.partials.AccordionNested.AccordionNestedItem';

const AccordionNestedItem: FC<AccordionNestedItemProps> = ({
  accordionItem: { header, content },
}) => {
  const [visibility, setVisibility] = useState(true);
  const { formatMessage } = useIntl();
  const onOpenIndexChange = () => {
    setVisibility(!visibility);
  };

  const contentText =
    typeof content === 'string' ? content : content && formatMessage(content);

  return (
    <div className="mb-4 last:mb-0">
      <AccordionHeaderItem
        title={header}
        isOpen={visibility}
        onClick={onOpenIndexChange}
        onKeyUp={onOpenIndexChange}
        role="button"
        tabIndex={0}
      />
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
            <div className="mt-1 text-sm text-gray-600">{contentText}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

AccordionNestedItem.displayName = displayName;

export default AccordionNestedItem;
