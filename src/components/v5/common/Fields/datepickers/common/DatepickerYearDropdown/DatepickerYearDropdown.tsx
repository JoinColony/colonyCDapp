import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Card from '~v5/shared/Card/index.ts';

import { type DatepickerYearDropdownProps } from './types.ts';

const DatepickerYearDropdown: FC<DatepickerYearDropdownProps> = ({
  onYearClick,
  selectedYear,
  selectedMonth,
  years,
  className,
}) => {
  const [isOpen, { toggle, toggleOff, registerContainerRef }] = useToggle();

  return (
    <div ref={registerContainerRef} className={clsx(className, 'relative')}>
      <button
        type="button"
        onClick={toggle}
        className="flex items-center justify-center gap-1.5 text-2 group"
      >
        {selectedMonth} {selectedYear}
        <CaretDown
          size={16}
          className={clsx('transition sm:group-hover:text-blue-400', {
            'text-gray-500': !isOpen,
            'text-blue-400': isOpen,
          })}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={accordionAnimation}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="overflow-hidden absolute top-full left-1/2 -translate-x-1/2"
          >
            <Card
              withPadding={false}
              className="min-w-[18.1rem] max-h-[17.75rem] overflow-auto bg-base-white p-3 pb-2"
            >
              <ul className="flex flex-wrap">
                {years.map((year) => (
                  <li key={year} className="basis-1/4 mb-1">
                    <button
                      type="button"
                      onClick={() => {
                        onYearClick(year);
                        toggleOff();
                      }}
                      className={clsx(
                        'flex justify-center items-center text-md transition-all py-2.5 px-3 rounded-[1.25rem] flex-shrink-0 min-w-[4rem]',
                        {
                          'bg-blue-400 text-base-white font-medium':
                            year === selectedYear,
                          'text-gray-700 sm:hover:bg-gray-100 sm:hover:font-medium':
                            year !== selectedYear,
                        },
                      )}
                    >
                      {year}
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatepickerYearDropdown;
