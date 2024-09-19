import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';

export const useSubDomains = () => {
  const selectedDomain = useGetSelectedDomainFilter();

  const { colony } = useColonyContext();

  const domains = colony.domains?.items || [];

  if (!selectedDomain) {
    return domains;
  }

  if (selectedDomain && selectedDomain.isRoot) {
    return domains?.filter((domain) => !domain?.isRoot);
  }

  return [];
};
