import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { TEAM_SEARCH_PARAM } from '~routes';
import { notNull } from '~utils/arrays';

import useColonyContext from './useColonyContext';

const useGetSelectedDomainFilter = () => {
  const { colony } = useColonyContext();
  const { domains } = colony || {};

  const [searchParams, setSearchParams] = useSearchParams();
  const domainId = searchParams.get(TEAM_SEARCH_PARAM);

  const selectedDomain = useMemo(
    () =>
      domains?.items
        .filter(notNull)
        .find((domain) => domain?.nativeId === parseInt(domainId ?? '0', 10)),
    [domains?.items, domainId],
  );

  useEffect(() => {
    if (selectedDomain && !domainId) {
      searchParams.delete(TEAM_SEARCH_PARAM);
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, domainId, selectedDomain]);

  return selectedDomain;
};

export default useGetSelectedDomainFilter;
