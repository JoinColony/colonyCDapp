import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useMobile } from '~hooks';
import useToggle from '~hooks/useToggle/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import { type ActionTableFiltersItemProps } from './types.ts';

const ActionTableFiltersItem: FC<ActionTableFiltersItemProps> = ({
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
        className="flex w-full items-center justify-between gap-2 uppercase text-gray-400 text-4"
      >
        {label}{' '}
        <CaretDown
          size={16}
          className={clsx('text-gray-900 transition', {
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
          'flex w-full items-center gap-2 rounded px-3.5 py-2 text-md text-gray-900 transition-colors sm:hover:bg-gray-50 sm:hover:font-medium',
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
          className="sm:min-w-[20.375rem]"
        >
          {children}
        </PopoverBase>
      )}
    </div>
  );
};

export default ActionTableFiltersItem;
