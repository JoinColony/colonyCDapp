// disabling rule due to filters having snake case
/* eslint-disable camelcase */
import { UserRole } from '~constants/permissions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  type ModelColonyRoleFilterInput,
  useGetRolesForDomainQuery,
} from '~gql';

interface UseEligibleSigneesParams {
  domainId: string;
  requiredRole: UserRole;
}

const getRoleFilter = (role: UserRole): Partial<ModelColonyRoleFilterInput> => {
  switch (role) {
    case UserRole.Payer:
      return {
        role_2: { eq: true },
        role_5: { eq: true },
        role_6: { eq: true },
      };
    case UserRole.Admin:
      return {
        role_2: { eq: true },
        role_3: { eq: true },
        role_5: { eq: true },
        role_6: { eq: true },
      };
    case UserRole.Owner:
      return {
        role_1: { eq: true },
        role_2: { eq: true },
        role_3: { eq: true },
        role_5: { eq: true },
        role_6: { eq: true },
      };
    default:
      return {};
  }
};

export const useEligibleSignees = ({
  domainId,
  requiredRole,
}: UseEligibleSigneesParams) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const { loading: loadingRoles, data: rolesData } = useGetRolesForDomainQuery({
    variables: {
      colonyAddress,
      domainId,
      filter: {
        isMultiSig: { eq: true },
        ...getRoleFilter(requiredRole),
      },
    },
    fetchPolicy: 'cache-first',
  });

  return {
    loadingRoles,
    eligibleSignees: rolesData?.getRoleByDomainAndColony?.items ?? [],
  };
};