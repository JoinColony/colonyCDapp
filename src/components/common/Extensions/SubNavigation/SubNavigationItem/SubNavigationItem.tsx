import React, { PropsWithChildren } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import clsx from 'clsx';

import Button from '~shared/Extensions/Button/Button';
import Icon from '~shared/Icon/Icon';

import { SubNavigationItemProps } from './types';
import styles from './SubNavigationItem.module.css';

const displayName = 'common.Extensions.SubNavigation.SubNavigationItem';

const SubNavigationItem: React.FC<PropsWithChildren<SubNavigationItemProps>> = ({
  label,
  content,
  isOpen,
  setOpen,
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
      <Button onClick={setOpen} mode="textButton" className={clsx(styles.button, { [styles.activeButton]: isOpen })}>
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
