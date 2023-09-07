import React, { useState } from 'react';
import clsx from 'clsx';
import { useMobile } from '~hooks';
import StepperButton from './partials/StepperButton/StepperButton';
import { StepperProps } from './types';
import { STEP_STAGE } from './partials/StepperButton/consts';
import { MIN_NUMBER_OF_STEPS_WITHOUT_MOBILE_NAVIGATION } from './consts';

const displayName = 'v5.Stepper';

const Stepper: React.FC<StepperProps> = ({
  activeStepIndex,
  setActiveStepIndex,
  items,
}) => {
  const [openItemIndex, setOpenItemIndex] = useState(activeStepIndex);
  const isMobile = useMobile();
  const withArrowsOnMobile =
    items.length > MIN_NUMBER_OF_STEPS_WITHOUT_MOBILE_NAVIGATION && isMobile;

  return items.length ? (
    <>
      <ul
        className={clsx(
          'flex justify-between sm:justify-start sm:flex-col sm:gap-4 relative',
          {
            'overflow-auto': withArrowsOnMobile,
          },
        )}
      >
        {items.map(({ key, content, isSkipped, heading }, index) => {
          const { decor, ...restHeading } = heading;
          const isNextStepOptional = items[index + 1]?.isOptional;
          const isNextStepSkipped = items[index + 1]?.isSkipped;

          return (
            <li
              key={key}
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
              `,
                {
                  'sm:before:bg-gray-900': index <= activeStepIndex,
                  'sm:before:bg-white': index > activeStepIndex,
                  'after:border-dashed': isNextStepOptional,
                  'after:border-gray-400': isNextStepSkipped,
                  'sm:before:border-gray-400': isSkipped,
                  'sm:before:border-gray-900': !isSkipped,
                  'w-1/4 flex-shrink-0': withArrowsOnMobile,
                },
              )}
            >
              <div className="flex flex-col sm:flex-row gap-[.375rem] items-center">
                <StepperButton
                  stage={
                    (index < activeStepIndex &&
                      !isSkipped &&
                      STEP_STAGE.Completed) ||
                    (index === activeStepIndex && STEP_STAGE.Current) ||
                    (isSkipped && STEP_STAGE.Skipped) ||
                    STEP_STAGE.Upcoming
                  }
                  onClick={() => {
                    setOpenItemIndex(index);

                    if (index > activeStepIndex) {
                      setActiveStepIndex(index);
                    }
                  }}
                  className="relative z-[1]"
                  disabled={index > activeStepIndex || isSkipped}
                  isHighlighted={index === openItemIndex && !isSkipped}
                  {...restHeading}
                />
                {decor || null}
              </div>
              {!isMobile && (
                <div
                  className={clsx(
                    'grid transition-[grid-template-rows_0.5s_ease-in-out]',
                    {
                      'grid-rows-[1fr]': index === openItemIndex,
                      'grid-rows-[0fr]': index !== openItemIndex,
                    },
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="pt-4">{content}</div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {isMobile && <div className="pt-4">{items[openItemIndex].content}</div>}
    </>
  ) : null;
};

Stepper.displayName = displayName;

export default Stepper;
