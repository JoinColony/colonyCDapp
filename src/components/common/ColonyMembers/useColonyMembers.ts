import { Id } from '@colony/colony-js';
import { useState } from 'react';

import { FormValues } from '~common/ColonyMembers/MembersFilter';
import {
  MemberType,
  VerificationType,
} from '~common/ColonyMembers/MembersFilter/filtersConfig';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useMobile } from '~hooks';

const useColonyMembers = () => {
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

  const isRootOrAllDomains =
    selectedDomainId === Id.RootDomain ||
    selectedDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID;

  const isMobile = useMobile();

  return {
    filters,
    setFilters,
    selectedDomainId,
    setSelectedDomainId,
    handleFilterChange,
    isRootOrAllDomains,
    isMobile,
  };
};

export default useColonyMembers;
