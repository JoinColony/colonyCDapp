import React, { FC } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

import { useToggle } from '~hooks';
import Card from '~v5/shared/Card';
import { accordionAnimation } from '~constants/accordionAnimation';

import { DatepickerYearDropdownProps } from './types';

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
                        'flex justify-center items-center text-md transition py-2.5 px-3 rounded-[1.25rem] flex-shrink-0 min-w-[4rem]',
                        {
                          'bg-blue-400 text-base-white font-medium':
                            year === selectedYear,
                          'text-gray-700 sm:hover:text-gray-900':
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
