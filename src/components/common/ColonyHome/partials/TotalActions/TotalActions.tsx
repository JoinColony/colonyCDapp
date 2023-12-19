import React from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

import { useGetTotalColonyActionsQuery } from '~gql';
import { createBaseActionFilter } from '~hooks/useActivityFeed/helpers';
import useColonyContext from '~hooks/useColonyContext';
import { useGetSelectedTeamFilter } from '~hooks/useTeamsBreadcrumbs';
import { COLONY_ACTIVITY_ROUTE } from '~routes';
import { formatText } from '~utils/intl';
import { setTeamColor } from '~utils/teams';
import WidgetBox from '~v5/common/WidgetBox';

const displayName = 'common.ColonyHome.TotalActions';

const TotalActions = () => {
  const { search: searchParams } = useLocation();
  const { colony } = useColonyContext();
  const { domains, colonyAddress = '' } = colony || {};
  const selectedTeam = useGetSelectedTeamFilter();
  const nativeTeamId = selectedTeam?.nativeId ?? undefined;

  const { data: totalActionData } = useGetTotalColonyActionsQuery({
    variables: {
      filter: {
        ...createBaseActionFilter(colonyAddress),
      },
    },
  });

  const totalActions = totalActionData?.searchColonyActions?.total ?? 0;
  const selectedTeamColor = domains?.items.find(
    (domain) => domain?.nativeId === nativeTeamId,
  )?.metadata?.color;

  const teamColor = setTeamColor(selectedTeamColor);

  return (
    <WidgetBox
      title={formatText({ id: 'widget.totalActions' })}
      value={<h4 className="heading-4">{totalActions}</h4>}
      className={clsx('text-base-white', {
        [teamColor]: selectedTeam,
        'bg-gray-900 border-gray-900': !selectedTeam,
      })}
      href={COLONY_ACTIVITY_ROUTE}
      searchParams={searchParams}
    />
  );
};

TotalActions.displayName = displayName;
export default TotalActions;
