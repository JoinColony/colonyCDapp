import { CaretDown } from '@phosphor-icons/react';
import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useMobile } from '~hooks';
import useToggle from '~hooks/useToggle/index.ts';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import NestedFilterItem from './NestedFilterItem.tsx';
import { type FilterValue, type RootFilterProps } from './types.ts';

function FilterItem<TValue extends FilterValue>({
  items,
  label,
  icon: Icon,
  onChange,
  path,
  value,
  title,
}: RootFilterProps<TValue>) {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      delayShow: 200,
      delayHide: 200,
      placement: 'left-start',
      interactive: true,
    });
  const isMobile = useMobile();
  const [isAccordionOpen, { toggle: toggleAccordion }] = useToggle({
    defaultToggleState: true,
  });
  const FilterItems = items.map(
    ({ label: nestedFilterItemLabel, name, items: nestedFilterItems }) => (
      <NestedFilterItem<TValue, 2>
        key={name.toString()}
        label={nestedFilterItemLabel}
        name={name}
        items={nestedFilterItems}
        onChange={onChange}
        value={value}
        path={`${path}.${name.toString()}`}
      />
    ),
  );

  return (
    <>
      {isMobile ? (
        <AccordionItem
          isOpen={isAccordionOpen}
          onToggle={toggleAccordion}
          title={title}
          icon={CaretDown}
          iconSize={16}
          className="mb-4 last:mb-0 [&_.accordion-icon]:text-gray-700 [&_.accordion-toggler]:mb-2 [&_.accordion-toggler]:uppercase [&_.accordion-toggler]:text-gray-400 [&_.accordion-toggler]:text-4 sm:[&_.accordion-toggler]:mb-0 sm:[&_.accordion-toggler]:px-3.5"
        >
          {FilterItems}
        </AccordionItem>
      ) : (
        <>
          <button
            type="button"
            className="subnav-button gap-3 px-0 sm:px-3.5"
            ref={setTriggerRef}
          >
            <Icon size={14} />
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
                className: 'py-6 px-2',
              }}
              className="mr-2 w-full sm:max-w-[13.25rem]"
            >
              <>
                <span className="px-3.5 pb-2 uppercase text-gray-400 text-4">
                  {title}
                </span>
                {FilterItems}
              </>
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
}

export default FilterItem;
