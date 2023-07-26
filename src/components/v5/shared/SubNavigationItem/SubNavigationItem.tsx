import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { noop } from 'lodash';

import Icon from '~shared/Icon';
import { SubNavigationItemProps } from './types';
import Tooltip from '~shared/Extensions/Tooltip';
import { useMobile } from '~hooks';
import PopoverBase from '../PopoverBase';
import NestedOptions from './partials/NestedOptions';
import { useMembersSubNavigation } from './hooks';

const displayName = 'v5.SubNavigationItem';

const SubNavigationItem: FC<SubNavigationItemProps> = ({
  iconName,
  title,
  options,
  option,
  shouldBeTooltipVisible = false,
  tooltipText = [],
  isCopyTriggered,
  onSelectParentFilter,
  shouldBeActionOnHover = true,
  onSelectNestedOption,
  selectedChildOption,
  checkedItems,
  nestedFilters,
  onClick,
}) => {
  const { formatMessage } = useIntl();
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    useMembersSubNavigation();
  const isMobile = useMobile();

  const tooltipContent = (
    <>
      <Icon name={iconName} appearance={{ size: 'extraSmall' }} />
      <span className="ml-2">{formatMessage({ id: title })}</span>
    </>
  );

  const handleSelectElement = () => {
    onClick?.();
    onSelectParentFilter?.(option);
  };

  const isOptionSelected = useMemo(
    () => options?.some((item) => item.option === option),
    [options, option],
  );

  return (
    <>
      <li>
        <button
          type="button"
          aria-label={formatMessage({ id: 'select.filter.menu.item' })}
          onClick={handleSelectElement}
          onMouseEnter={
            isMobile || shouldBeActionOnHover ? noop : handleSelectElement
          }
          className="subnav-button"
          ref={setTriggerRef}
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
          <NestedOptions
            selectedParentOption={option}
            selectedChildOption={selectedChildOption}
            onChange={onSelectNestedOption}
            checkedItems={checkedItems}
            nestedFilters={nestedFilters}
          />
        </PopoverBase>
      )}
    </>
  );
};

SubNavigationItem.displayName = displayName;

export default SubNavigationItem;
