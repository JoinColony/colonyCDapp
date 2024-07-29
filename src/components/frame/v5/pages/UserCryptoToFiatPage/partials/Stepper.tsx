import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { StepStage } from '~v5/shared/Stepper/partials/StepperButton/consts.ts';
import StepperButton from '~v5/shared/Stepper/partials/StepperButton/StepperButton.tsx';
import { type StepperProps } from '~v5/shared/Stepper/types.ts';

const displayName = 'CryptoToFiat.Stepper';

function Stepper<TKey extends React.Key>({
  activeStepKey,
  items,
}: StepperProps<TKey>): JSX.Element | null {
  const activeItemIndex = items.findIndex(({ key }) => key === activeStepKey);
  const [openItemIndex, setOpenItemIndex] = useState(activeItemIndex);
  const openedItem = items[openItemIndex];
  const listRef = React.useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    setOpenItemIndex(activeItemIndex);
  }, [activeItemIndex]);

  const itemsToShow = items.filter((i) => !i.isHidden).length;
  const isOneItemShown = itemsToShow === 1;

  const handleSetActiveStep = (index: number) => {
    setOpenItemIndex(index);
  };

  return items.length ? (
    <>
      <div className="flex w-full items-center gap-1">
        <ul
          className={clsx('relative flex w-full justify-between gap-3')}
          ref={listRef}
        >
          {items.map(({ key, heading, isHidden }, index) => {
            const { decor, ...restHeading } = heading;

            if (isHidden) {
              return undefined;
            }

            return (
              <motion.li
                key={key}
                initial="visible"
                variants={accordionAnimation}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={clsx(
                  `
                    relative
                    flex
                    w-auto
                    flex-grow
                    items-start
                    after:absolute
                    after:left-0
                    after:top-[.875rem]
                    after:flex
                    after:h-0
                    after:flex-1
                    after:flex-shrink-0
                    after:border-t
                    after:border-gray-900
                  `,
                  {
                    'after:w-[calc(100%+3rem)] last:flex-grow-0 last:after:hidden':
                      !isOneItemShown,
                    'justify-center after:w-[100%] after:!border-gray-300':
                      isOneItemShown,
                  },
                )}
              >
                <div className="flex flex-col items-start gap-[.375rem]">
                  <StepperButton
                    onClick={() => handleSetActiveStep(index)}
                    stage={
                      (index < activeItemIndex && StepStage.Completed) ||
                      (index === activeItemIndex && StepStage.Current) ||
                      StepStage.Upcoming
                    }
                    className="relative z-base"
                    isHighlighted={index === openItemIndex}
                    {...restHeading}
                  />
                  {decor || null}
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
      {!!openedItem.content && <div className="pt-4">{openedItem.content}</div>}
    </>
  ) : null;
}

Stepper.displayName = displayName;

export default Stepper;
