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
        className="group flex items-center justify-center gap-1.5 text-2"
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
            className="absolute left-1/2 top-full -translate-x-1/2 overflow-hidden"
          >
            <Card
              withPadding={false}
              className="max-h-[17.75rem] min-w-[18.1rem] overflow-auto bg-base-white p-3 pb-2"
            >
              <ul className="flex flex-wrap">
                {years.map((year) => (
                  <li key={year} className="mb-1 basis-1/4">
                    <button
                      type="button"
                      onClick={() => {
                        onYearClick(year);
                        toggleOff();
                      }}
                      className={clsx(
                        'flex min-w-[4rem] flex-shrink-0 items-center justify-center rounded-[1.25rem] px-3 py-2.5 text-md transition-all',
                        {
                          'bg-blue-400 font-medium text-base-white':
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
