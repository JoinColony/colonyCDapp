import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { noop } from 'lodash';
import { usePopperTooltip } from 'react-popper-tooltip';

import Icon from '~shared/Icon';
import { SubNavigationItemProps } from './types';
import Tooltip from '~shared/Extensions/Tooltip';
import { useMobile } from '~hooks';
import PopoverBase from '../PopoverBase';
import NestedOptions from './partials/NestedOptions';

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
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      delayShow: 200,
      delayHide: 200,
      placement: 'left-start',
      interactive: true,
    });

  const content = (
    <>
      <Icon name={iconName} appearance={{ size: 'extraSmall' }} />
      <span className="ml-2">{formatMessage({ id: title })}</span>
    </>
  );

  const handleSelectElement = () => {
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
              {content}
            </Tooltip>
          ) : (
            content
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
          <NestedOptions
            selectedParentOption={option}
            selectedChildOption={selectedChildOption}
            onChange={onSelectNestedOption}
            checkedItems={checkedItems}
          />
        </PopoverBase>
      )}
    </>
  );
};

SubNavigationItem.displayName = displayName;

export default SubNavigationItem;
