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

  useEffect(() => {
    async function fetchEligibleSignees() {
      try {
        setIsLoading(true);
        const response = await getEligibleSigneesApi({
          requiredRoles,
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
    // Since it's an array fetched from a function, it will always trigger this, so we "memo" it by stringifying it :)
  }, [colonyAddress, domainId, JSON.stringify(requiredRoles)]);

  return {
    isLoading,
    isError,
    ...signeesResult,
  };
};
