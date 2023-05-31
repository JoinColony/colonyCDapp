import React, { PropsWithChildren, FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import clsx from 'clsx';

import Button from '~shared/Extensions/Button/Button';
import Icon from '~shared/Extensions/Icon';
import { SubNavigationItemProps } from './types';
import styles from './SubNavigationItem.module.css';

const displayName = 'common.Extensions.SubNavigation.partials.SubNavigationItem';

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
        <Icon name={icon} appearance={{ size: 'small' }} />
        <span className="flex ml-2" ref={setTriggerRef}>
          {label}
        </span>
      </Button>
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
