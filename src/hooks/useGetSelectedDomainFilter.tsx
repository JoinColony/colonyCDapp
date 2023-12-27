import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { TEAM_SEARCH_PARAM } from '~routes';
import { findDomainByNativeId } from '~utils/domains';

import useColonyContext from './useColonyContext';

const useGetSelectedDomainFilter = () => {
  const { colony } = useColonyContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const domainId = searchParams.get(TEAM_SEARCH_PARAM);
  const selectedDomain = domainId
    ? findDomainByNativeId(parseInt(domainId, 10), colony)
    : undefined;

  useEffect(() => {
    if (selectedDomain && !domainId) {
      searchParams.delete(TEAM_SEARCH_PARAM);
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, domainId, selectedDomain]);

  return selectedDomain;
};

export default useGetSelectedDomainFilter;
