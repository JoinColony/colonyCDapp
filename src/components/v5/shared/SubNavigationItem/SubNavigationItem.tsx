import React, { type FC, useMemo } from 'react';

import { useFilterContext } from '~context/FilterContext/FilterContext.ts';
import { useMobile } from '~hooks/index.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';

import PopoverBase from '../PopoverBase/index.ts';

import { useMembersSubNavigation } from './hooks.ts';
import NestedOptions from './partials/NestedOptions.tsx';
import { type SubNavigationItemProps } from './types.ts';

const displayName = 'v5.SubNavigationItem';

const SubNavigationItem: FC<SubNavigationItemProps> = ({
  icon: Icon,
  title,
  option,
  shouldBeTooltipVisible = false,
  tooltipText = [],
  isCopyTriggered,
  nestedFilters,
  onClick,
  iconSize = 16,
}) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    useMembersSubNavigation();
  const { filterOptions: options } = useFilterContext();
  const isMobile = useMobile();

  const tooltipContent = (
    <>
      <Icon size={iconSize} />
      <span className="ml-2">{formatText({ id: title })}</span>
    </>
  );

  const isOptionSelected = useMemo(
    () => options?.some((item) => item.filterType === option),
    [options, option],
  );

  return (
    <>
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
              <span className="w-full text-3">{tooltipText}</span>
            }
            isOpen={isCopyTriggered}
            isSuccess={isCopyTriggered}
            placement={isMobile ? 'auto' : 'right'}
            className="flex w-full items-center"
          >
            {tooltipContent}
          </Tooltip>
        ) : (
          tooltipContent
        )}
      </button>
      {visible && isOptionSelected && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          withTooltipStyles={false}
          cardProps={{
            rounded: 's',
            hasShadow: true,
            className: 'py-4 sm:pt-6 sm:pb-4 px-2',
          }}
          className="w-full sm:max-w-[17.375rem]"
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
