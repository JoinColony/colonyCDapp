import { type Domain } from '~types/graphql.ts';

interface GetDomainsForMenuParams {
  domains: Domain[];
  selectedDomain?: Domain;
  maxDomains: number;
}

// this function will return all the domains + the selected one in the last place available to display
export const getOrderedDomains = ({
  domains,
  selectedDomain,
  maxDomains,
}: GetDomainsForMenuParams): Domain[] => {
  if (!selectedDomain) {
    return domains;
  }

  const selectedDomainIndex = domains.findIndex(
    (domain) => domain.nativeId === selectedDomain.nativeId,
  );
  // if selected domain is not in the dropdown, just return the same
  if (selectedDomainIndex < maxDomains) {
    return domains;
  }

  // Remove the selected domain from its current position
  const domainsWithoutSelected = domains.filter(
    (domain) => domain.nativeId !== selectedDomain.nativeId,
  );

  // Insert the selected domain at the last position before maxDomains
  const orderedDomains = [
    ...domainsWithoutSelected.slice(0, maxDomains - 1),
    selectedDomain,
    ...domainsWithoutSelected.slice(maxDomains - 1),
  ];

  return orderedDomains;
};
