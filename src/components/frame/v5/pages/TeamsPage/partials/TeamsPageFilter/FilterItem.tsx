import { CaretDown } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { type TeamsPageFiltersField } from '~frame/v5/pages/TeamsPage/types.ts';
import { type ModelSortDirection } from '~gql';
import { useMobile } from '~hooks';
import useToggle from '~hooks/useToggle/index.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/PopoverBase.tsx';

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
          className="mb-4 last:mb-0 [&_.accordion-icon]:text-gray-700 [&_.accordion-toggler]:mb-2 [&_.accordion-toggler]:uppercase [&_.accordion-toggler]:text-gray-400 [&_.accordion-toggler]:text-4 sm:[&_.accordion-toggler]:mb-0 sm:[&_.accordion-toggler]:px-3.5"
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
              className="subnav-button px-0 sm:px-3.5"
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
              className="mr-2 w-full sm:max-w-[13.25rem]"
            >
              <>
                <span className="px-3.5 pb-2 uppercase text-gray-400 text-4">
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
                    className="subnav-button px-0 sm:px-3.5"
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
