import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import Icon from '~shared/Icon';
import { SubNavigationItemProps } from './types';
import Tooltip from '~shared/Extensions/Tooltip';
import PopoverBase from '../PopoverBase';
import NestedOptions from './partials/NestedOptions';
import { useMembersSubNavigation } from './hooks';
import { useFilterContext } from '~context/FilterContext';

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
  const { formatMessage } = useIntl();
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    useMembersSubNavigation();
  const { filterOptions: options } = useFilterContext();

  const tooltipContent = (
    <>
      <Icon name={iconName} appearance={{ size: iconSize }} />
      <span className="ml-2">{formatMessage({ id: title })}</span>
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
          aria-label={formatMessage({ id: 'select.filter.menu.item' })}
          className="subnav-button"
          ref={setTriggerRef}
          onClick={onClick}
        >
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
          classNames="w-full sm:max-w-[17.375rem] mr-2"
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
