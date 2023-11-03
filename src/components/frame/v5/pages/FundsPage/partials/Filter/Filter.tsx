import React, { FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import Icon from '~shared/Icon';
import Checkbox from '~v5/common/Checkbox';
import FilterButton from '~v5/shared/Filter/FilterButton';
import PopoverBase from '~v5/shared/PopoverBase';
import { FilterItemProps, FilterProps } from './types';

const displayName = 'v5.pages.FundsPage.partials.Filter';

const FilterItem: FC<FilterItemProps> = ({
  parentKey,
  label,
  items,
  iconName,
  value,
  onChange,
}) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      delayShow: 200,
      delayHide: 200,
      placement: 'left-start',
      interactive: true,
    });

  const {
    getTooltipProps: getNestedTooltipProps,
    setTooltipRef: setNestedTooltipRef,
    setTriggerRef: setNestedTriggerRef,
  } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'left-start',
    interactive: true,
  });

  return (
    <>
      <button type="button" className="subnav-button gap-3" ref={setTriggerRef}>
        <Icon name={iconName} appearance={{ size: 'tiny' }} />
        {label}
      </button>
      {visible && (
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
          {items.map(({ items: nestedItems, ...item }) => (
            <>
              <div ref={setNestedTriggerRef}>
                <Checkbox
                  {...item}
                  isChecked={value?.[parentKey]?.[item.key]}
                  onChange={(e) => {
                    onChange({
                      ...value,
                      [parentKey]: {
                        ...value?.[parentKey],
                        [item.key]: e.target.checked,
                      },
                    });
                  }}
                />
              </div>
              {nestedItems &&
                nestedItems?.length > 0 &&
                value?.[parentKey]?.[item.key] && (
                  <PopoverBase
                    setTooltipRef={setNestedTooltipRef}
                    tooltipProps={getNestedTooltipProps}
                    withTooltipStyles={false}
                    cardProps={{
                      rounded: 's',
                      hasShadow: true,
                      className: 'py-4 px-2',
                    }}
                    classNames="w-full sm:max-w-[17.375rem] mr-2"
                  >
                    {nestedItems.map((nestedItem) => (
                      <Checkbox
                        {...nestedItem}
                        isChecked={
                          value?.[parentKey]?.[nestedItem.key]?.[item.key]
                        }
                        onChange={(e) => {
                          onChange({
                            ...value,
                            [parentKey]: {
                              ...value?.[parentKey],
                              [nestedItem.key]: {
                                ...value?.[parentKey]?.[nestedItem.key],
                                [item.key]: e.target.checked,
                              },
                            },
                          });
                        }}
                      />
                    ))}
                  </PopoverBase>
                )}
            </>
          ))}
        </PopoverBase>
      )}
    </>
  );
};

const Filter: FC<FilterProps> = ({ items: rootItems, onChange, value }) => {
  const {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible: isFiltersOpen,
  } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'bottom-start',
    trigger: 'click',
    interactive: true,
  });

  return (
    <>
      <div className="flex flex-row gap-2">
        <FilterButton isOpen={isFiltersOpen} setTriggerRef={setTriggerRef} />
      </div>
      {isFiltersOpen && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          withTooltipStyles={false}
          cardProps={{
            rounded: 's',
            hasShadow: true,
            className: 'pt-6 pb-4 px-2.5',
          }}
          classNames="w-full sm:max-w-[17.375rem]"
        >
          {rootItems.map((item) => (
            <FilterItem
              {...item}
              parentKey={item.key}
              value={value}
              onChange={onChange}
            />
          ))}
        </PopoverBase>
      )}
    </>
  );
};

Filter.displayName = displayName;

export default Filter;
