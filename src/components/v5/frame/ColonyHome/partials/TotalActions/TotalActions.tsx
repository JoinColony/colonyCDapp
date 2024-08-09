import clsx from 'clsx';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import useActionsCount from '~hooks/useActionsCount.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { COLONY_ACTIVITY_ROUTE } from '~routes/index.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
import { getTeamColor } from '~utils/teams.ts';
import WidgetBox from '~v5/common/WidgetBox/index.ts';

const displayName = 'v5.frame.ColonyHome.TotalActions';

const TotalActions = () => {
  const { search: searchParams } = useLocation();
  const { colony } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const nativeDomainId = selectedDomain?.nativeId;
  const { isDarkMode } = usePageThemeContext();

  const { actionsCount: totalActions, loading } = useActionsCount({
    domainId: nativeDomainId,
  });

  const selectedTeamColor = findDomainByNativeId(nativeDomainId, colony)
    ?.metadata?.color;

  const teamColor = getTeamColor(selectedTeamColor);

  return (
    <WidgetBox
      title={formatText({ id: 'widget.totalActions' })}
      value={
        <h4 className="heading-4">
          {loading ? (
            <div className="my-[0.25em] h-[1em] w-[60px] opacity-25 skeleton" />
          ) : (
            totalActions
          )}
        </h4>
      }
      className={clsx('text-base-white', {
        [teamColor]: selectedDomain,
        'border-gray-900 bg-gray-900': !selectedDomain && !isDarkMode,
        'bg-gray-200 text-gray-900 hover:!border-gray-200 hover:!bg-base-white':
          !selectedDomain && isDarkMode,
      })}
      href={COLONY_ACTIVITY_ROUTE}
      searchParams={searchParams}
    />
  );
};

TotalActions.displayName = displayName;
export default TotalActions;
