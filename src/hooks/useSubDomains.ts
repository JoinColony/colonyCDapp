import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useColonyFiltersContext } from '~context/GlobalFiltersContext/ColonyFiltersContext.ts';

export const useSubDomains = () => {
  const { filteredTeam } = useColonyFiltersContext();

  const { colony } = useColonyContext();

  const domains = colony.domains?.items || [];

  if (!filteredTeam) {
    return domains;
  }

  const selectedDomain = domains?.find(
    (domain) => domain?.nativeId?.toString() === filteredTeam,
  );

  if (selectedDomain && selectedDomain.isRoot) {
    return domains?.filter((domain) => !domain?.isRoot);
  }

  return [];
};
