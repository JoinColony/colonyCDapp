import clsx from 'clsx';
import React, { type PropsWithChildren, type FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { type SubNavigationItemProps } from './types.ts';

import styles from './SubNavigationItem.module.css';

const displayName = 'v5.common.SubNavigation.partials.SubNavigationItem';

const SubNavigationItem: FC<PropsWithChildren<SubNavigationItemProps>> = ({
  label,
  content,
  isOpen,
  setOpen,
  icon: Icon,
}) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef } = usePopperTooltip(
    {
      delayShow: 200,
      delayHide: 200,
      placement: 'bottom',
      trigger: 'click',
      visible: isOpen,
      interactive: true,
    },
    {
      modifiers: [
        {
          name: 'eventListeners',
          options: { scroll: true },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    },
  );

  return (
    <li>
      <button
        type="button"
        onClick={setOpen}
        className={clsx(styles.button, {
          [styles.activeButton]: isOpen,
        })}
      >
        <Icon size={18} />
        <span className="ml-2 flex" ref={setTriggerRef}>
          {label}
        </span>
      </button>
      <div className="relative h-auto">
        {isOpen && (
          <div
            ref={setTooltipRef}
            {...getTooltipProps({
              className: `${styles.tooltipContainer} tooltip-container p-0`,
            })}
          >
            {content}
          </div>
        )}
      </div>
    </li>
  );
};

SubNavigationItem.displayName = displayName;

export default SubNavigationItem;
