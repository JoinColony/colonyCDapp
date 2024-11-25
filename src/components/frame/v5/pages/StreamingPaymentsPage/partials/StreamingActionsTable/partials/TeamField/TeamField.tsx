import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import TeamBadge from '~v5/common/Pills/TeamBadge/TeamBadge.tsx';

interface TeamFieldProps {
  domainId: number;
}

const TeamField: FC<TeamFieldProps> = ({ domainId }) => {
  const { colony } = useColonyContext();
  const currentTeam = findDomainByNativeId(domainId, colony);

  return currentTeam ? (
    <TeamBadge
      name={currentTeam.metadata?.name || ''}
      color={currentTeam.metadata?.color}
    />
  ) : (
    <div />
  );
};

export default TeamField;
