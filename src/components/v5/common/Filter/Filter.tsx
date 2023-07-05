import React, { FC, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { useDetectClickOutside } from '~hooks';

import { FilterProps } from './types';
import FilterButton from '~v5/shared/Filter/FilterButton';
import FilterOptions from './partials/FilterOptions';

const displayName = 'v5.common.Filter';

const Filter: FC<FilterProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useDetectClickOutside({
    onTriggered: () => setIsOpen(false),
  });

  const { setTooltipRef, setTriggerRef } = usePopperTooltip(
    {
      delayShow: 200,
      delayHide: 200,
      placement: 'bottom',
      trigger: 'click',
      visible: isOpen,
      interactive: true,
    },
    {
      modifiers: [
        {
          name: 'eventListeners',
          options: { scroll: true },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    },
  );

  return (
    <div ref={ref}>
      <FilterButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        ref={setTriggerRef}
      />
      {isOpen && (
        <div
          className={`relative h-auto bg-base-white max-w-[20.375rem] border
          border-gray-200 rounded-lg py-3 px-1 mt-2`}
        >
          <div ref={setTooltipRef}>
            {/* @TODO: add search component */}
            <FilterOptions />
          </div>
        </div>
      )}
    </div>
  );
};

Filter.displayName = displayName;

export default Filter;
