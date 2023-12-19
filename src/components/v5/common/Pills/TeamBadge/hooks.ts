import { useColonyContext } from '~hooks';
import { setTeamBadge } from '~utils/teams';

export const useTeamBadge = (teamName: string) => {
  const { colony } = useColonyContext();
  const { domains } = colony || {};

  const team = domains?.items.find((item) => {
    const { metadata } = item || {};
    const { name } = metadata || {};

    return name === teamName;
  });

  const { metadata } = team || {};
  const { color } = metadata || {};

  const teamColor = setTeamBadge(color);

  return teamColor;
};
