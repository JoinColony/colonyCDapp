import { CaretDown } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { type ModelSortDirection } from '~gql';
import { useMobile } from '~hooks';
import useToggle from '~hooks/useToggle/index.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/PopoverBase.tsx';

import { type TeamsPageFiltersField } from '../../types.ts';

import { type TeamsPageFilterRootProps } from './types.ts';

const FilterItem: FC<TeamsPageFilterRootProps> = ({
  icon: Icon,
  name,
  label,
  title,
  items,
  onChange,
  filterValue,
}) => {
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

  return (
    <>
      {isMobile ? (
        <AccordionItem
          isOpen={isAccordionOpen}
          onToggle={toggleAccordion}
          title={title}
          icon={CaretDown}
          iconSize={16}
          className="[&_.accordion-toggler]:text-gray-400 [&_.accordion-toggler]:mb-2 sm:[&_.accordion-toggler]:mb-0 [&_.accordion-toggler]:text-4 [&_.accordion-toggler]:uppercase sm:[&_.accordion-toggler]:px-3.5 [&_.accordion-icon]:text-gray-700 mb-4 last:mb-0"
        >
          {items.map(({ value, label: checkboxLabel }) => (
            <Checkbox
              key={value}
              isChecked={
                filterValue.field === name && filterValue.direction === value
              }
              onChange={() => {
                onChange({
                  field: name,
                  direction: value,
                });
              }}
              classNames="subnav-button px-0 sm:px-3.5"
            >
              {checkboxLabel}
            </Checkbox>
          ))}
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
              classNames="w-full sm:max-w-[13.25rem] mr-2"
            >
              <>
                <span className="text-4 text-gray-400 px-3.5 uppercase">
                  {title}
                </span>
                {items.map(({ value, label: checkboxLabel }) => (
                  <Checkbox
                    key={value}
                    isChecked={
                      filterValue.field === name &&
                      filterValue.direction === value
                    }
                    onChange={() => {
                      onChange({
                        field: name as TeamsPageFiltersField,
                        direction: value as ModelSortDirection,
                      });
                    }}
                    classNames="subnav-button px-0 sm:px-3.5"
                  >
                    {checkboxLabel}
                  </Checkbox>
                ))}
              </>
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
};

export default FilterItem;
