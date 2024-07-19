/* eslint-disable camelcase */
import { ColonyRole, Id } from '@colony/colony-js';

import { apolloClient } from '~apollo';
import {
  GetMultiSigRolesForDomainDocument,
  type GetMultiSigRolesForDomainQuery,
  type GetMultiSigRolesForDomainQueryVariables,
  type ModelColonyRoleFilterInput,
} from '~gql';
import { type EligibleSignee } from '~types/multiSig.ts';

const COLONY_ROLE_TO_FILTER_KEY = {
  [ColonyRole.Root]: 'role_1',
  [ColonyRole.Arbitration]: 'role_2',
  [ColonyRole.Architecture]: 'role_3',
  [ColonyRole.Funding]: 'role_5',
  [ColonyRole.Administration]: 'role_6',
};

interface GetEligibleSigneesParams {
  colonyAddress: string;
  domainId: number;
  requiredRoles: ColonyRole[][];
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
  domainId,
  requiredRoles,
}: GetEligibleSigneesParams): Promise<GetEligibleSigneesResult> {
  const domainIds =
    domainId === Id.RootDomain ? [Id.RootDomain] : [Id.RootDomain, domainId];
  const signeesPerRole: SigneesPerRole = {};
  const uniqueEligibleSignees: SigneeEntry = {};

  // Loop through each array of required roles and fetch permission holders for each domain
  // It may seem scary, but this array will be longer than 1 just for managing permissions in a subdomain :)
  await Promise.all(
    requiredRoles.map(async (roleSet) => {
      // amplify doesn't provide it in the UI, but the syntax of or: [{att: {eq: SOMETHING}}, {att2: {eq: SOMETHING@}}] works!
      const roleFilter = roleSet
        .filter((role) => !!COLONY_ROLE_TO_FILTER_KEY[role])
        .map((role) => ({ [COLONY_ROLE_TO_FILTER_KEY[role]]: { eq: true } }));

      const queryFilter: ModelColonyRoleFilterInput = {
        isMultiSig: { eq: true },
        or: roleFilter,
      };

      const matchingUsers = await Promise.all(
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
            fetchPolicy: 'cache-first',
          });

          const usersWithRoles = (
            response.data.getRoleByDomainAndColony?.items ?? []
          ).filter((item) => {
            return item !== undefined && item !== null && !!item.targetUser;
          });

          return usersWithRoles;
        }),
      );

      // @TODO for some reason flatMap Typescript still assumes it's a 2d array
      matchingUsers.forEach((matchingUserSet) => {
        matchingUserSet.forEach((matchingUser) => {
          if (!matchingUser || !matchingUser.targetUser) {
            return;
          }

          const userAddress = matchingUser.targetAddress;

          // first we determine all the roles user is holding
          const userRoles = roleSet.filter(
            (role) =>
              matchingUser !== null &&
              !!matchingUser[COLONY_ROLE_TO_FILTER_KEY[role]],
          );

          // extremely unlikely, as this entire loop is going to be ran more than once just for one action type
          const existingUserEntry = uniqueEligibleSignees[userAddress];
          // but if the user exists, we just add the role into the array of held roles
          if (existingUserEntry) {
            uniqueEligibleSignees[userAddress] = {
              ...existingUserEntry,
              userRoles: [...existingUserEntry.userRoles, ...userRoles],
            };
          } else {
            uniqueEligibleSignees[userAddress] = {
              userAddress,
              user: matchingUser.targetUser,
              userRoles,
            };
          }

          userRoles.forEach((role) => {
            if (!signeesPerRole[role]) {
              signeesPerRole[role] = {};
            }

            signeesPerRole[role][userAddress] = {
              userAddress,
              user: matchingUser.targetUser,
              userRoles,
            };
          });
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
