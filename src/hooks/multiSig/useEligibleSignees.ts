import { type ColonyRole } from '@colony/colony-js';
import { useEffect, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  getEligibleSignees as getEligibleSigneesApi,
  type GetEligibleSigneesResult,
} from '~utils/multiSig/getEligibleSignees.ts';

interface UseEligibleSigneesParams {
  domainId: number;
  requiredRoles: ColonyRole[];
}

interface UseEligibleSigneesResult extends GetEligibleSigneesResult {
  isLoading: boolean;
  isError: boolean;
}

export const useEligibleSignees = ({
  domainId,
  requiredRoles,
}: UseEligibleSigneesParams): UseEligibleSigneesResult => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [signeesResult, setSigneesResult] = useState<GetEligibleSigneesResult>({
    countPerRole: {},
    uniqueEligibleSignees: {},
    signeesPerRole: {},
  });

  // Since it's an array fetched from a function, we "memo" this by stringify it to prevent it always triggering the useEffect
  const requiredRolesString = JSON.stringify(requiredRoles);

  useEffect(() => {
    async function fetchEligibleSignees() {
      const parsedRequiredRoles = JSON.parse(requiredRolesString);
      try {
        setIsLoading(true);
        const response = await getEligibleSigneesApi({
          requiredRoles: parsedRequiredRoles,
          colonyAddress,
          domainId,
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
  }, [colonyAddress, domainId, requiredRolesString]);

  return {
    isLoading,
    isError,
    ...signeesResult,
  };
};
