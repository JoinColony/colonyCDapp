import clsx from 'clsx';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { useGetTotalColonyActionsQuery } from '~gql';
import { useGetSelectedDomainFilter } from '~hooks';
import { getBaseSearchActionsFilterVariable } from '~hooks/useActivityFeed/helpers';
import useColonyContext from '~hooks/useColonyContext';
import { COLONY_ACTIVITY_ROUTE } from '~routes';
import { findDomainByNativeId } from '~utils/domains';
import { formatText } from '~utils/intl';
import { getTeamColor } from '~utils/teams';
import WidgetBox from '~v5/common/WidgetBox';

const displayName = 'common.ColonyHome.TotalActions';

const TotalActions = () => {
  const { search: searchParams } = useLocation();
  const { colony } = useColonyContext();
  const { colonyAddress = '' } = colony || {};
  const selectedDomain = useGetSelectedDomainFilter();
  const nativeDomainId = selectedDomain?.nativeId;

  const { data: totalActionData } = useGetTotalColonyActionsQuery({
    variables: {
      filter: {
        ...getBaseSearchActionsFilterVariable(colonyAddress),
      },
    },
  });

  const totalActions = totalActionData?.searchColonyActions?.total ?? 0;
  const selectedTeamColor = findDomainByNativeId(nativeDomainId, colony)
    ?.metadata?.color;

  const teamColor = getTeamColor(selectedTeamColor);

  return (
    <WidgetBox
      title={formatText({ id: 'widget.totalActions' })}
      value={<h4 className="heading-4">{totalActions}</h4>}
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
