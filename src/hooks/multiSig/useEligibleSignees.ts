import { type ColonyRole } from '@colony/colony-js';
import { useEffect, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  getEligibleSignees as getEligibleSigneesApi,
  type GetEligibleSigneesResult,
} from '~utils/multiSig/getEligibleSignees.ts';

interface UseEligibleSigneesParams {
  domainIds: number[];
  requiredRoles: ColonyRole[];
}

interface UseEligibleSigneesResult extends GetEligibleSigneesResult {
  isLoading: boolean;
  isError: boolean;
}

export const useEligibleSignees = ({
  domainIds,
  requiredRoles,
}: UseEligibleSigneesParams): UseEligibleSigneesResult => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [signeesResult, setSigneesResult] = useState<GetEligibleSigneesResult>({
    countPerRole: {},
    uniqueEligibleSignees: {},
    signeesPerRole: {},
  });

  // Since they are both arrays fetched from a function, we "memo" this by stringifying them to prevent always triggering the useEffect
  const requiredRolesString = JSON.stringify(requiredRoles);
  const domainIdsString = JSON.stringify(domainIds);

  useEffect(() => {
    async function fetchEligibleSignees() {
      const parsedRequiredRoles = JSON.parse(requiredRolesString);
      const parsedDomainIds = JSON.parse(domainIdsString);

      try {
        setIsLoading(true);
        const response = await getEligibleSigneesApi({
          requiredRoles: parsedRequiredRoles,
          colonyAddress,
          domainIds: parsedDomainIds,
        });
        setSigneesResult(response);
      } catch (error) {
        console.warn('Error while fetching eligible signees', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEligibleSignees();
  }, [colonyAddress, domainIdsString, requiredRolesString]);

  return {
    isLoading,
    isError,
    ...signeesResult,
  };
};
