import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation';
import { useMobile } from '~hooks';

import { MIN_NUMBER_OF_STEPS_WITHOUT_MOBILE_NAVIGATION } from './consts';
import { StepStage } from './partials/StepperButton/consts';
import StepperButton from './partials/StepperButton/StepperButton';
import { StepperProps } from './types';

const displayName = 'v5.Stepper';

function Stepper<TKey extends React.Key>({
  activeStepKey,
  setActiveStepKey,
  items,
}: StepperProps<TKey>): JSX.Element | null {
  const activeItemIndex = items.findIndex(({ key }) => key === activeStepKey);
  const [openItemIndex, setOpenItemIndex] = useState(activeItemIndex);
  const isMobile = useMobile();
  const withArrowsOnMobile =
    items.length > MIN_NUMBER_OF_STEPS_WITHOUT_MOBILE_NAVIGATION && isMobile;
  const openedItem = items[openItemIndex];

  useEffect(() => {
    setOpenItemIndex(activeItemIndex);
  }, [activeItemIndex]);

  return items.length ? (
    <>
      <ul
        className={clsx(
          'flex justify-between sm:justify-start sm:flex-col relative',
          {
            'overflow-auto': withArrowsOnMobile,
          },
        )}
      >
        {items.map(({ key, content, isSkipped, isHidden, heading }, index) => {
          const { decor, ...restHeading } = heading;
          const isNextStepOptional = items[index + 1]?.isOptional;
          const isNextStepSkipped = items[index + 1]?.isSkipped;
          const itemDisabled = index > activeItemIndex || isSkipped;

          return (
            <motion.li
              key={key}
              initial="visible"
              animate={isHidden ? 'hidden' : 'visible'}
              variants={accordionAnimation}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={clsx(
                `
                  relative
                  flex
                  flex-grow
                  last:flex-grow-0
                  items-start
                  sm:flex-col
                  sm:before:absolute
                  sm:before:left-0
                  sm:before:top-2
                  sm:before:z-[1]
                  sm:before:h-[.6875rem]
                  sm:before:w-[.6875rem]
                  sm:before:border
                  sm:before:rounded-full
                  sm:pl-[1.625rem]
                  after:absolute
                  after:h-0
                  after:flex
                  after:flex-1
                  after:flex-shrink-0
                  after:border-t
                  sm:after:h-[calc(100%+1rem)]
                  after:w-full
                  sm:after:w-0
                  sm:after:border-l
                  sm:after:border-t-0
                  after:border-gray-900
                  after:top-[.875rem]
                  after:left-0
                  sm:after:left-[.2813rem]
                  last:after:hidden
                  sm:before:border-gray-900
                `,
                {
                  'sm:mb-4 sm:last-mb-0': !isHidden,
                  'sm:before:bg-gray-900': index <= activeItemIndex,
                  'sm:before:bg-base-white': index > activeItemIndex,
                  'after:border-dashed': isNextStepOptional,
                  'after:border-gray-400': isNextStepSkipped,
                  'w-1/4 flex-shrink-0': withArrowsOnMobile,
                },
              )}
            >
              <div className="flex flex-col sm:flex-row gap-[.375rem] items-center">
                <StepperButton
                  stage={
                    (index < activeItemIndex &&
                      !isSkipped &&
                      StepStage.Completed) ||
                    (index === activeItemIndex && StepStage.Current) ||
                    (isSkipped && StepStage.Skipped) ||
                    StepStage.Upcoming
                  }
                  onClick={() => {
                    setOpenItemIndex(index);

                    if (index > activeItemIndex) {
                      setActiveStepKey(key);
                    }
                  }}
                  className="relative z-[1]"
                  disabled={itemDisabled}
                  isHighlighted={index === openItemIndex && !isSkipped}
                  {...restHeading}
                />
                {decor || null}
              </div>
              {!isMobile && !itemDisabled && (
                <div
                  className={clsx(
                    'grid transition-[grid-template-rows_0.5s_ease-in-out] w-full',
                    {
                      'grid-rows-[1fr]': index === openItemIndex,
                      'grid-rows-[0fr]': index !== openItemIndex,
                    },
                  )}
                >
                  <div className="overflow-hidden w-full">
                    <div className="pt-4 w-full">{content}</div>
                  </div>
                </div>
              )}
            </motion.li>
          );
        })}
      </ul>
      {isMobile && <div className="pt-4">{openedItem.content}</div>}
    </>
  ) : null;
}

Stepper.displayName = displayName;

export default Stepper;
