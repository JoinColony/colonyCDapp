import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { Children, type FC } from 'react';

import MemberCardPlaceholder from './partials/MemberCardPlaceholder/index.ts';
import { type MemberCardListProps } from './types.ts';

const displayName = 'v5.common.MemberCardList';

const MemberCardList: FC<MemberCardListProps> = ({
  children,
  placeholderCardProps,
  isSimple,
}) => {
  const childrenLength = Children.count(children);

  return childrenLength > 0 ||
    (childrenLength === 0 && placeholderCardProps) ? (
    <ul
      className={clsx('grid', {
        'grid-cols-1 gap-x-6 gap-y-6 sm:gap-y-4 md:grid-cols-2 lg:grid-cols-3':
          !isSimple,
        'grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3': isSimple,
      })}
    >
      {/* @todo: update the animation */}
      <AnimatePresence initial={false}>
        {Children.map(children, (card, index) => (
          <motion.li
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{ opacity: 0, y: 10 }}
            // I don't know how else to key it better
            // eslint-disable-next-line react/no-array-index-key
            key={`member-card-${index}`}
            className={clsx({ 'min-h-[11.5rem]': !isSimple })}
          >
            {card}
          </motion.li>
        ))}
        {placeholderCardProps && (
          <motion.li
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            // transition={{ duration: 0.5 }}
            className={clsx({ 'min-h-[11.5rem]': !isSimple })}
          >
            <MemberCardPlaceholder {...placeholderCardProps} />
          </motion.li>
        )}
      </AnimatePresence>
    </ul>
  ) : null;
};

MemberCardList.displayName = displayName;

export default MemberCardList;
