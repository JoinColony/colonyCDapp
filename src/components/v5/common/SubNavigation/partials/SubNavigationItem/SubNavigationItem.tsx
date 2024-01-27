import clsx from 'clsx';
import React, { PropsWithChildren, FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import Icon from '~shared/Icon/index.ts';

import { SubNavigationItemProps } from './types.ts';

import styles from './SubNavigationItem.module.css';

const displayName = 'v5.common.SubNavigation.partials.SubNavigationItem';

const SubNavigationItem: FC<PropsWithChildren<SubNavigationItemProps>> = ({
  label,
  content,
  isOpen,
  setOpen,
  icon,
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
        <Icon name={icon} appearance={{ size: 'small' }} />
        <span className="flex ml-2" ref={setTriggerRef}>
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
