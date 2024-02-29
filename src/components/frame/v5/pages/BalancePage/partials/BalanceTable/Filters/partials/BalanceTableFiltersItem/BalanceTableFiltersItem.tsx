import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useMobile } from '~hooks';
import useToggle from '~hooks/useToggle/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import { type BalanceTableFiltersItemProps } from './types.ts';

const BalanceTableFiltersItem: FC<BalanceTableFiltersItemProps> = ({
  icon: Icon,
  label,
  children,
}) => {
  const isMobile = useMobile();
  const [isOpen, { toggle }] = useToggle({ defaultToggleState: true });
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      delayShow: 200,
      delayHide: 200,
      placement: 'left-start',
      interactive: true,
      offset: [0, 16],
      trigger: 'hover',
    });

  return isMobile ? (
    <div>
      <button
        type="button"
        onClick={toggle}
        className="flex justify-between items-center gap-2 w-full text-4 text-gray-400 uppercase"
      >
        {label}{' '}
        <CaretDown
          size={16}
          className={clsx('transition text-gray-900', {
            'rotate-180': isOpen,
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
            className="overflow-hidden"
          >
            <div className="w-full pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <div>
      <button
        type="button"
        ref={setTriggerRef}
        className={clsx(
          'flex gap-2 w-full items-center text-md transition-colors text-gray-900 sm:hover:bg-gray-50 sm:hover:font-medium rounded py-2 px-3.5',
          {
            'bg-gray-50 font-medium': visible,
          },
        )}
      >
        <Icon size={14} />
        {label}
      </button>
      {visible && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          withTooltipStyles={false}
          cardProps={{
            rounded: 's',
            hasShadow: true,
            className: 'pt-6 pb-4 px-2.5',
          }}
          classNames="sm:min-w-[20.375rem]"
        >
          {children}
        </PopoverBase>
      )}
    </div>
  );
};

export default BalanceTableFiltersItem;
