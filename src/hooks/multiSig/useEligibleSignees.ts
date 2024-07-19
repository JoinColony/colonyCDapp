import { type ColonyRole } from '@colony/colony-js';
import { useEffect, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  getEligibleSignees as getEligibleSigneesApi,
  type GetEligibleSigneesResult,
} from '~utils/multiSig/getEligibleSignees.ts';

interface UseEligibleSigneesParams {
  domainId: number;
  requiredRoles: ColonyRole[][];
}

interface UseEligibleSigneesResult extends GetEligibleSigneesResult {
  isLoading: boolean;
}

export const useEligibleSignees = ({
  domainId,
  requiredRoles,
}: UseEligibleSigneesParams): UseEligibleSigneesResult => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const [isLoading, setIsLoading] = useState(false);
  const [signeesResult, setSigneesResult] = useState<GetEligibleSigneesResult>({
    countPerRole: {},
    uniqueEligibleSignees: {},
    signeesPerRole: {},
  });

  useEffect(() => {
    async function fetchEligibleSignees() {
      setIsLoading(true);
      const response = await getEligibleSigneesApi({
        requiredRoles,
        colonyAddress,
        domainId,
      });
      setSigneesResult(response);
      setIsLoading(false);
    }

    fetchEligibleSignees();
    // Don't think of removing JSON.stringify, because 2d arrays are really really bad hook deps
  }, [colonyAddress, domainId, JSON.stringify(requiredRoles)]);

  return {
    isLoading,
    ...signeesResult,
  };
};
