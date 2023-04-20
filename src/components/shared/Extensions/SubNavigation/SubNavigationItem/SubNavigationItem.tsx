import React, { PropsWithChildren } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import clsx from 'clsx';

import Button from '~shared/Extensions/Button/Button';

import { SubNavigationItemProps } from './types';
import styles from './SubNavigationItem.module.css';
import Icon from '~shared/Icon/Icon';

const displayName = 'Extensions.SubNavigation.SubNavigationItem';

const SubNavigationItem: React.FC<PropsWithChildren<SubNavigationItemProps>> = ({
  label,
  content,
  isOpen,
  setOpen,
  id,
  icon,
}) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef } = usePopperTooltip(
    {
      delayShow: 200,
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
      ],
    },
  );

  return (
    <li>
      <Button
        onClick={() => setOpen(id)}
        mode="textButton"
        className={clsx(styles.button, { [styles.activeButton]: isOpen })}
      >
        <Icon name={icon} />
        <div ref={setTriggerRef}>{label}</div>
      </Button>
      <div className="relative h-auto">
        {isOpen && (
          <div
            ref={setTooltipRef}
            {...getTooltipProps({
              className: `${styles.tooltipContainer} tooltip-container text-base-white z-[9999] relative font-medium text-sm p-3`,
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
