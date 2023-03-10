import { useState } from 'react';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN_ID } from '~constants';
import { useColonyContext, useMobile } from '~hooks';

import { FormValues } from '~common/ColonyMembers/MembersFilter';
import {
  MemberType,
  VerificationType,
} from '~common/ColonyMembers/MembersFilter/filtersConfig';

const useColonyMembers = () => {
  const { colony, loading } = useColonyContext();

  const [filters, setFilters] = useState<FormValues>({
    memberType: MemberType.All,
    verificationType: VerificationType.All,
  });

  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const handleFilterChange = (name, value) => {
    if (filters[name] !== value) {
      setFilters((filter) => ({
        ...filter,
        [name]: value,
      }));
    }
  };

  const isRootDomain =
    selectedDomainId === ROOT_DOMAIN_ID ||
    selectedDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID;

  const isMobile = useMobile();

  return {
    colony,
    loading,
    filters,
    setFilters,
    selectedDomainId,
    setSelectedDomainId,
    handleFilterChange,
    isRootDomain,
    isMobile,
  };
};

export default useColonyMembers;
