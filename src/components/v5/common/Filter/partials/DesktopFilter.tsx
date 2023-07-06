import React, { FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { DesktopFilterProps } from '../types';
import FilterButton from '~v5/shared/Filter/FilterButton';
import FilterOptions from './FilterOptions';
import { filterOptions } from '../consts';

const displayName = 'v5.common.Filter.partials.DesktopFilter';

const DesktopFilter: FC<DesktopFilterProps> = ({ isOpened, setOpened }) => {
  const { setTooltipRef, setTriggerRef, visible } = usePopperTooltip(
    {
      delayShow: 200,
      delayHide: 200,
      placement: 'bottom',
      trigger: 'click',
      interactive: true,
      visible: isOpened,
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
    <>
      <FilterButton
        isOpen={isOpened || visible}
        onClick={() => setOpened(!isOpened)}
        ref={setTriggerRef}
      />
      {visible && (
        <div
          className="relative h-auto bg-base-white max-w-[20.375rem] border
            border-gray-200 rounded-lg py-3 px-1 mt-2"
          ref={setTooltipRef}
        >
          {/* @TODO: add search component */}
          <FilterOptions options={filterOptions} />
        </div>
      )}
    </>
  );
};

DesktopFilter.displayName = displayName;

export default DesktopFilter;
