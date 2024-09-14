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
          'h-full border-r border-gray-200 bg-base-white px-4 py-2 text-gray-700 hover:bg-gray-50',
          { 'bg-gray-50': visible },
        )}
      >
        <DotsThree size={16} className="mt-1" />
      </button>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps()}
          className="flex flex-col gap-2 rounded-b-lg border-b border-l border-r border-gray-200 bg-base-white px-4 py-2"
        >
          {domains.map((domain) => (
            <button
              type="button"
              key={`TeamsDropdown.${domain.nativeId}`}
              onClick={() => handleClick(domain)}
              className="w-full text-start text-sm font-medium text-gray-700 hover:font-semibold hover:text-gray-900"
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