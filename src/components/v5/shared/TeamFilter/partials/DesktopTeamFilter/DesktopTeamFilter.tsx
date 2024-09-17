import clsx from 'clsx';
import { throttle } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { notMaybe } from '~utils/arrays/index.ts';

import AllTeamsItem from '../AllTeamsItem.tsx';
import CreateNewTeamItem from '../CreateNewTeamItem.tsx';
import TeamItem from '../TeamItem.tsx';
import TeamsDropdown from '../TeamsDropdown/TeamsDropdown.tsx';

import { getOrderedDomains } from './helpers.ts';

const displayName = 'v5.shared.TeamFilter.DesktopTeamFilter';

const DesktopTeamFilter = () => {
  const [teamsWidth, setTeamsWidth] = useState(0);
  const [overflowingItemIndex, setOverFlowingItemIndex] = useState(-1);

  const teamItemsRef = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    colony: { domains },
  } = useColonyContext();

  const selectedDomain = useGetSelectedDomainFilter();
  const isAllTeamsFilterActive = selectedDomain === undefined;

  // this is in memo due to being a dependency for the other memo
  const allDomains = useMemo(() => {
    return domains?.items.filter(notMaybe) || [];
  }, [domains?.items]);

  useEffect(() => {
    const { current: teamsElement } = containerRef;

    const handleResize = throttle((entries) => {
      const newWidth = entries[0].contentRect.width;

      setTeamsWidth(newWidth);
    }, 200);

    const observer = new ResizeObserver(handleResize);

    if (teamsElement) {
      observer.observe(teamsElement);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (containerRef.current && teamItemsRef.current.length) {
      let overflowingIndex = -1;

      for (let i = 0; i < teamItemsRef.current.length; i += 1) {
        const item = teamItemsRef.current[i];

        if (item) {
          if (item.offsetTop > containerRef.current.offsetTop) {
            overflowingIndex = i;
            break;
          }
        }
      }

      setOverFlowingItemIndex((prevIndex) => {
        if (prevIndex !== overflowingIndex) {
          return overflowingIndex; // Only update state if there's an actual change
        }
        return prevIndex;
      });
    }
  }, [teamsWidth, selectedDomain]);

  const displayDomains = useMemo(() => {
    if (overflowingItemIndex === -1) {
      return allDomains;
    }
    /*
     * @NOTE if maxDomains confuses you, if the 4th element is overflowing, it's index is 3
     * that means that we can show 3 domains and everything from the 4th one onwards is in a domainsForDropdown
     * so it checks out :)
     */
    return getOrderedDomains({
      maxDomains: overflowingItemIndex,
      domains: allDomains,
      selectedDomain,
    });
  }, [allDomains, overflowingItemIndex, selectedDomain]);

  return (
    <div className="flex h-[34px] w-fit overflow-hidden whitespace-nowrap rounded-lg border border-solid border-gray-200">
      <AllTeamsItem selected={isAllTeamsFilterActive} />
      <div className="flex flex-wrap overflow-hidden" ref={containerRef}>
        {displayDomains.map((domain, index) => (
          <div
            ref={(el) => {
              if (el) {
                teamItemsRef.current[index] = el;
              }
            }}
            key={`teamFilter.${domain.id}`}
            className={clsx('flex-1 flex-shrink-0', {
              'pointer-events-none opacity-0':
                overflowingItemIndex > -1 && index >= overflowingItemIndex,
            })}
          >
            <TeamItem
              selected={selectedDomain?.nativeId === domain.nativeId}
              domain={domain}
            />
          </div>
        ))}
      </div>
      {overflowingItemIndex > -1 && (
        <TeamsDropdown domains={displayDomains.slice(overflowingItemIndex)} />
      )}
      <CreateNewTeamItem />
    </div>
  );
};

DesktopTeamFilter.displayName = displayName;
export default DesktopTeamFilter;
