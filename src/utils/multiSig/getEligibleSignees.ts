import { ColonyRole } from '@colony/colony-js';

import { apolloClient } from '~apollo';
import {
  type ColonyUserRoleFragment,
  GetMultiSigRolesForDomainDocument,
  type GetMultiSigRolesForDomainQuery,
  type GetMultiSigRolesForDomainQueryVariables,
  type ModelColonyRoleFilterInput,
  type ColonyActionRoles,
} from '~gql';
import { type EligibleSignee } from '~types/multiSig.ts';
import { notMaybe } from '~utils/arrays/index.ts';

type MultiSigColonyRoles =
  | ColonyRole.Recovery
  | ColonyRole.Root
  | ColonyRole.Arbitration
  | ColonyRole.Architecture
  | ColonyRole.Funding
  | ColonyRole.Administration;

const COLONY_ROLE_TO_FILTER_KEY: Record<
  MultiSigColonyRoles,
  keyof ColonyActionRoles
> = {
  [ColonyRole.Recovery]: 'role_0',
  [ColonyRole.Root]: 'role_1',
  [ColonyRole.Arbitration]: 'role_2',
  [ColonyRole.Architecture]: 'role_3',
  [ColonyRole.Funding]: 'role_5',
  [ColonyRole.Administration]: 'role_6',
};

interface GetEligibleSigneesParams {
  colonyAddress: string;
  domainIds: number[];
  requiredRoles: ColonyRole[];
}

interface SigneeEntry {
  [userAddress: string]: EligibleSignee;
}

interface SigneesPerRole {
  [role: number]: SigneeEntry;
}

export interface GetEligibleSigneesResult {
  signeesPerRole: SigneesPerRole;
  countPerRole: {
    [role: number]: number;
  };
  uniqueEligibleSignees: SigneeEntry;
}

export async function getEligibleSignees({
  colonyAddress,
  domainIds,
  requiredRoles,
}: GetEligibleSigneesParams): Promise<GetEligibleSigneesResult> {
  const signeesPerRole: SigneesPerRole = {};
  const uniqueEligibleSignees: SigneeEntry = {};

  const roleFilter = requiredRoles
    .filter((role) => !!COLONY_ROLE_TO_FILTER_KEY[role])
    .map((role) => ({ [COLONY_ROLE_TO_FILTER_KEY[role]]: { eq: true } }));

  const queryFilter: ModelColonyRoleFilterInput = {
    isMultiSig: { eq: true },
    or: roleFilter,
  };
  // amplify doesn't provide it in the UI, but the syntax of or: [{att: {eq: SOMETHING}}, {att2: {eq: SOMETHING@}}] works!
  // but sadly having 2 or statements is impossible so we need to loop through domains

  await Promise.all(
    domainIds.map(async (permissionDomainId) => {
      const response = await apolloClient.query<
        GetMultiSigRolesForDomainQuery,
        GetMultiSigRolesForDomainQueryVariables
      >({
        query: GetMultiSigRolesForDomainDocument,
        variables: {
          domainId: `${colonyAddress}_${permissionDomainId}`,
          filter: queryFilter,
        },
      });

      const usersWithRoles: ColonyUserRoleFragment[] = (
        response.data.getRoleByDomainAndColony?.items || []
      ).filter(notMaybe);

      usersWithRoles.forEach((userRoleEntry) => {
        if (!notMaybe(userRoleEntry.targetUser)) {
          return;
        }

        const userAddress = userRoleEntry.targetAddress;

        // first we determine all the roles user is holding
        const userRoles = requiredRoles.filter(
          (role) => !!userRoleEntry[COLONY_ROLE_TO_FILTER_KEY[role]],
        );

        // This means a user has the same permissions in both the parent and the child domain
        // The main edge case here is: a user has Administration in root and Funding in the child domain, the action is simple payment
        // in that case we can just concat the array since they will sign for both roles
        const existingUserEntry = uniqueEligibleSignees[userAddress];

        if (existingUserEntry) {
          uniqueEligibleSignees[userAddress] = {
            ...existingUserEntry,
            userRoles: [
              ...new Set([...existingUserEntry.userRoles, ...userRoles]),
            ],
          };
        } else {
          uniqueEligibleSignees[userAddress] = {
            userAddress,
            user: userRoleEntry.targetUser,
            userRoles,
          };
        }

        userRoles.forEach((role) => {
          if (!signeesPerRole[role]) {
            signeesPerRole[role] = {};
          }

          // Because it's a nested loop, the upper if statement doesn't infer the type in here
          if (!notMaybe(userRoleEntry.targetUser)) {
            return;
          }

          signeesPerRole[role][userAddress] = {
            userAddress,
            user: userRoleEntry.targetUser,
            userRoles,
          };
        });
      });
    }),
  );

  const countPerRole: { [role: number]: number } = Object.entries(
    signeesPerRole,
  ).reduce((countPerRoleAcc, [role, signees]) => {
    return {
      ...countPerRoleAcc,
      [role]: Object.keys(signees).length,
    };
  }, {});

  return { signeesPerRole, uniqueEligibleSignees, countPerRole };
}
