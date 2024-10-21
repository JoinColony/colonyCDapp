import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { InView } from 'react-intersection-observer';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';

import { MIN_NUMBER_OF_STEPS_WITHOUT_MOBILE_NAVIGATION } from './consts.ts';
import { StepStage } from './partials/StepperButton/consts.ts';
import StepperButton from './partials/StepperButton/StepperButton.tsx';
import { type StepperProps } from './types.ts';

const displayName = 'v5.Stepper';

function Stepper<TKey extends React.Key>({
  activeStepKey,
  setActiveStepKey,
  setCurrentStepKey,
  items,
  disablePreviousSteps = false,
}: StepperProps<TKey>): JSX.Element | null {
  const activeItemIndex = items.findIndex(({ key }) => key === activeStepKey);
  const [hiddenItem, setHiddenItem] = useState<TKey | string | undefined>(
    undefined,
  );
  const [openItemIndex, setOpenItemIndex] = useState(activeItemIndex);
  const isMobile = useMobile();
  const openedItem = items[openItemIndex];
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const [isScrollableList, setIsScrollableList] = useState(false);
  const withArrowsOnMobile =
    (isScrollableList ||
      items.length > MIN_NUMBER_OF_STEPS_WITHOUT_MOBILE_NAVIGATION) &&
    isMobile;

  const scrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollBy({
        left: -70,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollBy({
        left: 70,
        behavior: 'smooth',
      });
    }
  };

  const handleResize = () => {
    const element = listRef.current;
    if (element) {
      setIsScrollableList(element.scrollWidth > element.clientWidth);
    }
  };

  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setOpenItemIndex(activeItemIndex);
    handleResize();
  }, [activeItemIndex]);

  const handleChange = (name: TKey | string, inView: boolean) => {
    if (!inView) {
      setHiddenItem(name);
    } else {
      setHiddenItem(undefined);
    }
  };

  useEffect(() => {
    if (hiddenItem && listRef.current && isMobile && isScrollableList) {
      const index = items.findIndex(({ key }) => key === hiddenItem);
      if (index > -1) {
        listRef.current.scrollBy({
          left: 70 * index,
          behavior: 'smooth',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openItemIndex, isMobile]);

  return items.length ? (
    <>
      <div className="flex w-full items-center gap-1" data-testid="stepper">
        {isMobile && isScrollableList && (
          <button
            type="button"
            onClick={scrollLeft}
            aria-label={formatText({ id: 'ariaLabel.previous' })}
          >
            <CaretLeft className="text-gray-400" size={18} />
          </button>
        )}
        <ul
          className={clsx(
            'relative flex w-full justify-between gap-3 sm:flex-col sm:justify-start sm:gap-0',
            {
              'overflow-auto no-scrollbar': withArrowsOnMobile,
            },
          )}
          ref={listRef}
        >
          {items.map(
            ({ key, content, isSkipped, isHidden, heading }, index) => {
              const {
                decor,
                className: headingClassName,
                ...restHeading
              } = heading;
              const isNextStepOptional = items[index + 1]?.isOptional;
              const isNextStepSkipped = items[index + 1]?.isSkipped;
              const itemDisabled =
                isSkipped ||
                index > activeItemIndex ||
                (index < activeItemIndex && disablePreviousSteps);

              return !isHidden ? (
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
                    w-auto
                    flex-grow
                    items-start
                    after:absolute
                    after:left-0
                    after:top-[.875rem]
                    after:flex
                    after:h-0
                    after:w-[calc(100%+3rem)]
                    after:flex-1
                    after:flex-shrink-0
                    after:border-t
                    after:border-gray-900
                    last:flex-grow-0
                    last:after:hidden
                    sm:flex-col
                    sm:pl-[1.625rem]
                    sm:before:absolute
                    sm:before:left-0
                    sm:before:top-2
                    sm:before:z-base
                    sm:before:h-[.6875rem]
                    sm:before:w-[.6875rem]
                    sm:before:rounded-full
                    sm:before:border
                    sm:before:border-gray-900
                    sm:after:left-[.2813rem]
                    sm:after:h-[calc(100%+1rem)]
                    sm:after:w-0
                    sm:after:border-l-[.084rem]
                    sm:after:border-t-0
                  `,
                    {
                      'sm:last-mb-0 sm:mb-4': !isHidden,
                      'sm:before:bg-gray-900': index <= activeItemIndex,
                      'sm:before:bg-base-white': index > activeItemIndex,
                      'after:border-dashed': isNextStepOptional,
                      'after:border-gray-400': isNextStepSkipped,
                      'w-1/4 flex-shrink-0': withArrowsOnMobile,
                    },
                  )}
                >
                  <InView
                    as="div"
                    onChange={(inView) => handleChange(key, inView)}
                    className="z-base flex flex-col items-start gap-[.375rem] sm:flex-row sm:items-center"
                  >
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
                        setHiddenItem(undefined);
                        setCurrentStepKey?.(key);

                        if (index > activeItemIndex && setActiveStepKey) {
                          setActiveStepKey(key);
                        }
                      }}
                      className={clsx(headingClassName, 'relative z-base')}
                      disabled={itemDisabled}
                      isHighlighted={index === openItemIndex && !isSkipped}
                      {...restHeading}
                    />
                    {decor || null}
                  </InView>
                  {!isMobile && !itemDisabled && !!content && (
                    <div
                      className={clsx(
                        'grid w-full transition-[grid-template-rows_0.5s_ease-in-out]',
                        {
                          'grid-rows-[1fr]': index === openItemIndex,
                          'grid-rows-[0fr]': index !== openItemIndex,
                        },
                      )}
                    >
                      <div className="w-full overflow-hidden">
                        <div className="w-full pt-4">{content}</div>
                      </div>
                    </div>
                  )}
                </motion.li>
              ) : undefined;
            },
          )}
        </ul>
        {isMobile && isScrollableList && (
          <button
            type="button"
            onClick={scrollRight}
            aria-label={formatText({ id: 'ariaLabel.next' })}
          >
            <CaretRight className="text-gray-400" size={18} />
          </button>
        )}
      </div>
      {isMobile && !!openedItem?.content && (
        <div className="pt-4">{openedItem.content}</div>
      )}
    </>
  ) : null;
}

Stepper.displayName = displayName;

export default Stepper;
