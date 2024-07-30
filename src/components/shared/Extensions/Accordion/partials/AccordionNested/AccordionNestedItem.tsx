import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC, useState } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { type AccordionNestedItemProps } from '~shared/Extensions/Accordion/types.ts';
import { formatText } from '~utils/intl.ts';

import AccordionHeaderItem from './AccordionNestedHeader.tsx';

const displayName =
  'Extensions.Accordion.partials.AccordionNested.AccordionNestedItem';

const AccordionNestedItem: FC<AccordionNestedItemProps> = ({
  accordionItem: { header, content },
}) => {
  const [visibility, setVisibility] = useState(false);

  const onOpenIndexChange = () => {
    setVisibility(!visibility);
  };

  const contentText = formatText(content);

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
            <div className="mt-1 text-sm text-gray-600 first-letter:uppercase">
              {contentText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

AccordionNestedItem.displayName = displayName;

export default AccordionNestedItem;
