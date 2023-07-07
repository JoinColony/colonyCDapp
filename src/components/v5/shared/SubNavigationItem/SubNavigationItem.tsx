import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import styles from './SubNavigationItem.module.css';
import Icon from '~shared/Icon';
import { SubNavigationItemProps } from './types';
import Tooltip from '~shared/Extensions/Tooltip';
import { useMembersSubNavigation } from './hooks';

const displayName = 'v5.SubNavigationItem';

const SubNavigationItem: FC<SubNavigationItemProps> = ({
  iconName,
  title,
  shouldBeTooltipVisible = false,
  tooltipText = [],
}) => {
  const { formatMessage } = useIntl();
  const { handleClick, isCopyTriggered } = useMembersSubNavigation();

  const content = (
    <>
      <Icon name={iconName} appearance={{ size: 'extraSmall' }} />
      <span className="ml-2">{formatMessage({ id: title })}</span>
    </>
  );

  return (
    <li>
      <button type="button" onClick={handleClick} className={styles.button}>
        {shouldBeTooltipVisible ? (
          <Tooltip
            tooltipContent={
              <span className="text-3 underline w-full">
                {formatMessage({
                  id: isCopyTriggered ? tooltipText[0] : tooltipText[1],
                })}
              </span>
            }
            isSuccess={isCopyTriggered}
          >
            {content}
          </Tooltip>
        ) : (
          content
        )}
      </button>
    </li>
  );
};

SubNavigationItem.displayName = displayName;

export default SubNavigationItem;
