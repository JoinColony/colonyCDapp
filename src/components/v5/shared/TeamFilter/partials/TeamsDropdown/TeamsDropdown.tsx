import { DotsThree } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { useSearchParams } from 'react-router-dom';

import { TEAM_SEARCH_PARAM } from '~routes';
import { type Domain } from '~types/graphql.ts';

const displayName = 'v5.shared.TeamFilter.TeamsDropdown';

interface TeamsDropdownProps {
  domains: Domain[];
}

// no need to handle deselection since as soon as it's selected, it will go to the other menu
const TeamsDropdown: FC<TeamsDropdownProps> = ({ domains }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible, triggerRef } =
    usePopperTooltip({
      placement: 'bottom-end',
      trigger: ['click'],
      interactive: true,
      closeOnOutsideClick: true,
      offset: [0, 1],
    });

  const handleClick = (domain: Domain) => {
    searchParams.set(TEAM_SEARCH_PARAM, domain.nativeId.toString());
    setSearchParams(searchParams);

    triggerRef?.click();
  };

  return (
    <div>
      <button
        type="button"
        ref={setTriggerRef}
        className={clsx(
          'relative h-full border-y border-r border-gray-200 bg-base-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus-visible:z-10',
          { 'bg-gray-50': visible },
        )}
      >
        <DotsThree size={16} className="mt-1" />
      </button>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps()}
          className="z-aboveBase flex flex-col gap-2 rounded-b-lg border-b border-l border-r border-gray-200 bg-base-white py-2"
        >
          {domains.map((domain) => (
            <button
              type="button"
              key={`TeamsDropdown.${domain.nativeId}`}
              onClick={() => handleClick(domain)}
              aria-label={domain.metadata?.name} // Used to set the after content, which is used to pre-reserve the space required for the bold hover state
              className="mx-4 w-full text-start text-sm text-transparent bold-on-hover"
            >
              {domain.metadata?.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

TeamsDropdown.displayName = displayName;
export default TeamsDropdown;
