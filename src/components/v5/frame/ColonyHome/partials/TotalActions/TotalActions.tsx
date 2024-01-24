import clsx from 'clsx';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext';
import useActionsCount from '~hooks/useActionsCount';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter';
import { COLONY_ACTIVITY_ROUTE } from '~routes';
import { findDomainByNativeId } from '~utils/domains';
import { formatText } from '~utils/intl';
import { getTeamColor } from '~utils/teams';
import WidgetBox from '~v5/common/WidgetBox';

const displayName = 'v5.frame.ColonyHome.TotalActions';

const TotalActions = () => {
  const { search: searchParams } = useLocation();
  const { colony } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const nativeDomainId = selectedDomain?.nativeId;

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
            <div className="skeleton opacity-25 w-[60px] h-[1em] my-[0.25em]" />
          ) : (
            totalActions
          )}
        </h4>
      }
      className={clsx('text-base-white', {
        [teamColor]: selectedDomain,
        'bg-gray-900 border-gray-900': !selectedDomain,
      })}
      href={COLONY_ACTIVITY_ROUTE}
      searchParams={searchParams}
    />
  );
};

TotalActions.displayName = displayName;
export default TotalActions;
