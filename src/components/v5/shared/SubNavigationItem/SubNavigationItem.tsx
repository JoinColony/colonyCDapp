import React, { FC, useMemo } from 'react';

import Icon from '~shared/Icon';
import Tooltip from '~shared/Extensions/Tooltip';
import { useFilterContext } from '~context/FilterContext';
import { formatText } from '~utils/intl';
import { useMobile } from '~hooks';

import PopoverBase from '../PopoverBase';
import { useMembersSubNavigation } from './hooks';
import { SubNavigationItemProps } from './types';
import NestedOptions from './partials/NestedOptions';

const displayName = 'v5.SubNavigationItem';

const SubNavigationItem: FC<SubNavigationItemProps> = ({
  iconName,
  title,
  option,
  shouldBeTooltipVisible = false,
  tooltipText = [],
  isCopyTriggered,
  nestedFilters,
  onClick,
  iconSize = 'extraSmall',
}) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    useMembersSubNavigation();
  const { filterOptions: options } = useFilterContext();
  const isMobile = useMobile();

  const tooltipContent = (
    <>
      <Icon name={iconName} appearance={{ size: iconSize }} />
      <span className="ml-2">{formatText({ id: title })}</span>
    </>
  );

  const isOptionSelected = useMemo(
    () => options?.some((item) => item.filterType === option),
    [options, option],
  );

  return (
    <>
      <li>
        <button
          type="button"
          aria-label={formatText({ id: 'select.filter.menu.item' })}
          className="subnav-button"
          ref={setTriggerRef}
          onClick={onClick}
        >
          {shouldBeTooltipVisible ? (
            <Tooltip
              tooltipContent={
                <span className="text-3 w-full">{tooltipText}</span>
              }
              isOpen={isCopyTriggered}
              isSuccess={isCopyTriggered}
              placement={isMobile ? 'auto' : 'right'}
              className="w-full flex items-center"
            >
              {tooltipContent}
            </Tooltip>
          ) : (
            tooltipContent
          )}
        </button>
      </li>
      {visible && isOptionSelected && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          withTooltipStyles={false}
          cardProps={{
            rounded: 's',
            hasShadow: true,
            className: 'py-4 px-2',
          }}
          classNames="w-full sm:max-w-[17.375rem]"
        >
          {option && nestedFilters && (
            <NestedOptions
              parentOption={option}
              nestedFilters={nestedFilters}
            />
          )}
        </PopoverBase>
      )}
    </>
  );
};

SubNavigationItem.displayName = displayName;

export default SubNavigationItem;
