import { useColonyContext } from '~hooks';
import { getTeamBadgeStyles } from '~utils/teams';

export const useTeamBadge = (teamName: string) => {
  const {
    colony: { domains },
  } = useColonyContext();

  const team = domains?.items.find((item) => {
    const { metadata } = item || {};
    const { name } = metadata || {};

    return name === teamName;
  });

  const { metadata } = team || {};
  const { color } = metadata || {};

  const teamColor = getTeamBadgeStyles(color);

  return teamColor;
};
