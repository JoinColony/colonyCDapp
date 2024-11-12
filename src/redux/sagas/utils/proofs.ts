import {
  type ColonyRole,
  Id,
  ClientType,
  getPermissionProofs,
  type ColonyNetworkClient,
} from '@colony/colony-js';
import { BigNumber, constants, type BigNumberish } from 'ethers';

import { type ColonyManager } from '~context/index.ts';
import { type ColonyRoleFragment } from '~gql';
import { getUserRolesForDomain } from '~transformers';
import { type Domain } from '~types/graphql.ts';

import getColonyManager from './getColonyManager.ts';

interface GetChildIndexLocalParams {
  networkClient: ColonyNetworkClient;
  parentDomainNativeId: BigNumberish;
  parentDomainSkillId: BigNumberish;
  domainNativeId: BigNumberish;
  domainSkillId: BigNumberish;
}

// @TODO reword this so the params aren't named "parent" since that insinuates you can't pass in the same domain twice (you in fact can)
export async function getChildIndexLocal({
  networkClient,
  parentDomainNativeId,
  parentDomainSkillId,
  domainNativeId,
  domainSkillId,
}: GetChildIndexLocalParams): Promise<BigNumber> {
  if (BigNumber.from(parentDomainNativeId).eq(BigNumber.from(domainNativeId))) {
    return constants.MaxUint256;
  }

  const { children } = await networkClient.getSkill(parentDomainSkillId);
  const idx = children.findIndex((childSkillId) =>
    childSkillId.eq(domainSkillId),
  );

  if (idx < 0) {
    throw new Error(
      `Could not find ${domainNativeId} as a child of ${parentDomainNativeId}`,
    );
  }

  return BigNumber.from(idx);
}

type SingleRole = ColonyRole;
type RoleGroup = ColonyRole[];
type RoleGroupSet = ColonyRole[][];

type RequiredColonyRoleGroup = SingleRole | RoleGroup | RoleGroupSet;

interface GetSinglePermissionProofsLocalParams {
  networkClient: ColonyNetworkClient;
  colonyRoles: ColonyRoleFragment[];
  colonyDomains: Domain[];
  requiredDomainId: number;
  requiredColonyRole: SingleRole;
  permissionAddress: string;
  isMultiSig: boolean;
}

const getSinglePermissionProofsLocal = async ({
  networkClient,
  colonyRoles,
  colonyDomains,
  requiredDomainId,
  requiredColonyRole,
  permissionAddress,
  isMultiSig,
  /* [permissionDomainId, childSkillIndex, permissionAddress] */
}: GetSinglePermissionProofsLocalParams): Promise<
  [BigNumber, BigNumber, string]
> => {
  const userRolesInDomain = getUserRolesForDomain({
    colonyRoles,
    userAddress: permissionAddress,
    domainId: requiredDomainId,
    constraint: 'excludeInheritedRoles',
    isMultiSig,
  });
  const userRolesInRoot = getUserRolesForDomain({
    colonyRoles,
    userAddress: permissionAddress,
    domainId: Id.RootDomain,
    constraint: 'excludeInheritedRoles',
    isMultiSig,
  });

  if (!permissionAddress) {
    throw new Error(
      `Could not determine address for permission proofs. Please use a signer or provide a custom address`,
    );
  }

  const hasPermissionInDomain = userRolesInDomain.includes(requiredColonyRole);
  if (hasPermissionInDomain) {
    return [
      BigNumber.from(requiredDomainId),
      constants.MaxUint256,
      permissionAddress,
    ];
  }
  // @TODO: once we allow nested domains on the network level, this needs to traverse down the skill/domain tree. Use binary search
  const foundDomainId = BigNumber.from(Id.RootDomain);
  const hasPermissionInAParentDomain =
    userRolesInRoot.includes(requiredColonyRole);

  if (!hasPermissionInAParentDomain) {
    throw new Error(
      `${permissionAddress} does not have the permission ${requiredColonyRole} in any parent domain`,
    );
  }

  const rootDomain = colonyDomains.find((domain) =>
    BigNumber.from(domain.nativeId).eq(foundDomainId),
  );
  const permissionDomain = colonyDomains.find(
    (domain) => domain.nativeId === requiredDomainId,
  );

  if (!rootDomain) {
    throw new Error('Cannot find root domain in colony domains');
  }

  if (!permissionDomain) {
    throw new Error(
      `Cannot find domain with id of ${requiredDomainId} in colony domains`,
    );
  }

  const idx = await getChildIndexLocal({
    networkClient,
    parentDomainNativeId: foundDomainId,
    parentDomainSkillId: rootDomain.nativeSkillId,
    domainNativeId: permissionDomain.nativeId,
    domainSkillId: permissionDomain.nativeSkillId,
  });

  if (idx.lt(0)) {
    throw new Error(
      `${permissionAddress} does not have the permission ${requiredColonyRole} in any parent domain`,
    );
  }
  return [foundDomainId, idx, permissionAddress];
};

interface GetMultiPermissionProofsLocalParams {
  networkClient: ColonyNetworkClient;
  colonyRoles: ColonyRoleFragment[];
  colonyDomains: Domain[];
  requiredDomainId: number;
  requiredColonyRoles: RoleGroup;
  permissionAddress: string;
  isMultiSig: boolean;
}

const getMultiPermissionProofsLocal = async ({
  networkClient,
  colonyRoles,
  colonyDomains,
  requiredDomainId,
  requiredColonyRoles,
  permissionAddress,
  isMultiSig,
}: GetMultiPermissionProofsLocalParams): Promise<
  [BigNumber, BigNumber, string]
> => {
  const proofs = await Promise.all(
    requiredColonyRoles.map((role) =>
      getSinglePermissionProofsLocal({
        networkClient,
        colonyRoles,
        colonyDomains,
        requiredDomainId,
        requiredColonyRole: role,
        permissionAddress,
        isMultiSig,
      }),
    ),
  );

  if (proofs.length === 1) {
    return proofs[0];
  }

  // We are checking that all of the permissions resolve to the same domain and childSkillIndex
  for (let idx = 0; idx < proofs.length; idx += 1) {
    const [permissionDomainId, childSkillIndex, address] = proofs[idx];
    if (
      !permissionDomainId.eq(proofs[0][0]) ||
      !childSkillIndex.eq(proofs[0][1])
    ) {
      throw new Error(
        `${address} has to have all required roles (${requiredColonyRoles}) in the same domain`,
      );
    }
  }

  // It does not need to be an array because if we get here, all the proofs are the same
  return proofs[0];
};

interface GetAnyPermissionProofsLocalParams {
  networkClient: ColonyNetworkClient;
  colonyRoles: ColonyRoleFragment[];
  colonyDomains: Domain[];
  requiredDomainId: number;
  requiredColonyRoles: RoleGroup;
  permissionAddress: string;
  isMultiSig: boolean;
}

// Returns the proof if any ROLE in any group of permissions is valid
export const getAnyPermissionProofsLocal = async ({
  networkClient,
  colonyRoles,
  colonyDomains,
  requiredDomainId,
  requiredColonyRoles,
  permissionAddress,
  isMultiSig,
}: GetAnyPermissionProofsLocalParams): Promise<
  [BigNumber, BigNumber, string]
> => {
  for (const singleRole of requiredColonyRoles) {
    try {
      // Attempt to get proofs for the current RoleGroup
      // eslint-disable-next-line no-await-in-loop
      const proof = await getSinglePermissionProofsLocal({
        networkClient,
        colonyRoles,
        colonyDomains,
        requiredDomainId,
        requiredColonyRole: singleRole,
        permissionAddress,
        isMultiSig,
      });

      // If we get here, it means the current singleRole satisfies the conditions,
      // so we can return its proof.
      return proof;
    } catch (error) {
      // Catch any errors and continue to the next singleRole in the RoleGroup or the next RoleGroup in the RoleGroupSet
      // No need to do anything here, just continue to the next iteration
    }
  }

  // If we exhaust all SingleRoles in the RoleGroups in the RoleGroupSet without finding a valid proof,
  // we throw an error indicating none of the RoleGroups have the required permissions.
  throw new Error(
    `${permissionAddress} does not have any required roles in any of the specified domains`,
  );
};

interface GetAnyGroupPermissionProofsLocalParams {
  networkClient: ColonyNetworkClient;
  colonyRoles: ColonyRoleFragment[];
  colonyDomains: Domain[];
  requiredDomainId: number;
  requiredColonyRoles: RoleGroupSet;
  permissionAddress: string;
  isMultiSig: boolean;
}

// Returns the proof if any GROUP of permissions is valid
const getAnyGroupPermissionProofsLocal = async ({
  networkClient,
  colonyRoles,
  colonyDomains,
  requiredDomainId,
  requiredColonyRoles,
  permissionAddress,
  isMultiSig,
}: GetAnyGroupPermissionProofsLocalParams): Promise<
  [BigNumber, BigNumber, string]
> => {
  // Iterate over each RoleGroup in the RoleGroupSet
  for (const roleGroup of requiredColonyRoles) {
    try {
      // Attempt to get proofs for the current RoleGroup
      // eslint-disable-next-line no-await-in-loop
      const proof = await getMultiPermissionProofsLocal({
        networkClient,
        colonyRoles,
        colonyDomains,
        requiredDomainId,
        requiredColonyRoles: roleGroup,
        permissionAddress,
        isMultiSig,
      });

      // If we get here, it means the current roleGroup satisfies the conditions,
      // so we can return its proof.
      return proof;
    } catch (error) {
      // Catch any errors and continue to the next RoleGroup in the RoleGroupSet
      // No need to do anything here, just continue to the next iteration
    }
  }

  // If we exhaust all RoleGroups in the RoleGroupSet without finding a valid proof,
  // we throw an error indicating none of the RoleGroups have the required permissions.
  throw new Error(
    `${permissionAddress} does not have any required roles in any of the specified domains`,
  );
};

interface GetPermissionProofsLocalParams {
  networkClient: ColonyNetworkClient;
  colonyRoles: ColonyRoleFragment[];
  colonyDomains: Domain[];
  requiredDomainId: number;
  requiredColonyRoles: RequiredColonyRoleGroup;
  permissionAddress: string;
  isMultiSig?: boolean;
}

export const getPermissionProofsLocal = async ({
  networkClient,
  colonyRoles,
  colonyDomains,
  requiredDomainId,
  requiredColonyRoles,
  permissionAddress,
  isMultiSig = false,
}: GetPermissionProofsLocalParams): Promise<[BigNumber, BigNumber, string]> => {
  if (!Array.isArray(requiredColonyRoles)) {
    const singleRole = requiredColonyRoles;
    // ColonyRole.Root
    return getSinglePermissionProofsLocal({
      networkClient,
      colonyRoles,
      colonyDomains,
      requiredDomainId,
      requiredColonyRole: singleRole,
      permissionAddress,
      isMultiSig,
    });
  }

  if (!Array.isArray(requiredColonyRoles[0])) {
    const roleGroup = requiredColonyRoles as RoleGroup;
    if (roleGroup.length === 1) {
      // [ColonyRole.Root]
      return getSinglePermissionProofsLocal({
        networkClient,
        colonyRoles,
        colonyDomains,
        requiredDomainId,
        requiredColonyRole: roleGroup[0],
        permissionAddress,
        isMultiSig,
      });
    }
    // [ColonyRole.Root, ColonyRole.Architecture]
    return getMultiPermissionProofsLocal({
      networkClient,
      colonyRoles,
      colonyDomains,
      requiredDomainId,
      requiredColonyRoles: roleGroup,
      permissionAddress,
      isMultiSig,
    });
  }
  const roleGroupSet = requiredColonyRoles as RoleGroupSet;
  // [[ColonyRole.Root]] // [[ColonyRole.Root, ColonyRole.Architecture]] // [[ColonyRole.Root], [ColonyRole.Architecture]]
  return getAnyGroupPermissionProofsLocal({
    networkClient,
    colonyRoles,
    colonyDomains,
    requiredDomainId,
    requiredColonyRoles: roleGroupSet,
    permissionAddress,
    isMultiSig,
  });
};

/*
 * How this works (or should work) is, you pass it two domains and it returns you the domain the action is in and both child skill indices
 * Friendly note, a childSkillIndex of MaxUint256 means that we are targeting the domain itself, not any of its children
 * It then returns the domain the action is happening in:
 * 1. if we are moving funds from a parent domain to the child domain, it's created in a common parent domain, fromChildSkillIndex should be MaxUint256, toChildSkillIndex should be the index of the child domain in the parent
 * 2. If we are moving funds from a child domain to a parent domain, it's created in a common parent domain, fromChildSkillIndex should be the index of the child domain in the parent, toChildSkillIndex should be MaxUint256
 * 3. If we are moving funds inside the same domain (when funding an expenditure), it should return that domain, fromChildSkillIndex should be MaxUint256 and toChildSkillIndex should be MaxUint256
 */
interface GetMoveFundsPermissionProofsResult {
  actionDomainId: BigNumberish;
  fromChildSkillIndex: BigNumber;
  toChildSkillIndex: BigNumber;
}
export async function getMoveFundsPermissionProofs({
  colonyAddress,
  fromDomainId,
  toDomainId,
  colonyDomains,
}: {
  colonyAddress: string;
  fromDomainId: BigNumberish;
  toDomainId: BigNumberish;
  colonyDomains: Domain[];
}): Promise<GetMoveFundsPermissionProofsResult> {
  const colonyManager: ColonyManager = await getColonyManager();

  const colonyClient = await colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  if (Number(fromDomainId) === Number(toDomainId)) {
    return {
      actionDomainId: fromDomainId, // they are the same anyways
      fromChildSkillIndex: constants.MaxUint256,
      toChildSkillIndex: constants.MaxUint256,
    };
  }

  // if they are not the same we must find their common parent domain, yet another thing to fix when we do nested teams
  const commonParentDomain = Id.RootDomain;

  const parentDomain = colonyDomains.find((domain) =>
    BigNumber.from(domain.nativeId).eq(commonParentDomain),
  );
  const fromDomain = colonyDomains.find((domain) =>
    BigNumber.from(domain.nativeId).eq(fromDomainId),
  );
  const toDomain = colonyDomains.find((domain) =>
    BigNumber.from(domain.nativeId).eq(toDomainId),
  );

  if (!fromDomain || !toDomain || !parentDomain) {
    throw new Error('No fromDomain, expenditurePotDomain or rootDomain found');
  }

  const fromChildSkillIndex = await getChildIndexLocal({
    networkClient: colonyClient.networkClient,
    parentDomainSkillId: parentDomain.nativeSkillId,
    parentDomainNativeId: parentDomain.nativeId,
    domainSkillId: fromDomain.nativeSkillId,
    domainNativeId: fromDomain.nativeId,
  });

  const toChildSkillIndex = await getChildIndexLocal({
    networkClient: colonyClient.networkClient,
    parentDomainSkillId: parentDomain.nativeSkillId,
    parentDomainNativeId: parentDomain.nativeId,
    domainSkillId: toDomain.nativeSkillId,
    domainNativeId: toDomain.nativeId,
  });

  return {
    actionDomainId: commonParentDomain,
    fromChildSkillIndex,
    toChildSkillIndex,
  };
}

export function* getMultiPermissionProofs({
  colonyAddress,
  domainId,
  roles,
  customAddress,
}: {
  colonyAddress: string;
  domainId: BigNumberish;
  roles: ColonyRole[];
  customAddress?: string;
}) {
  const colonyManager: ColonyManager = yield getColonyManager();

  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const proofs = yield Promise.all(
    roles.map((role) =>
      getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        domainId,
        role,
        customAddress,
      ),
    ),
  );

  // We are checking that all of the permissions resolve to the same domain and childSkillIndex
  for (let idx = 0; idx < proofs.length; idx += 1) {
    const [permissionDomainId, childSkillIndex, address] = proofs[idx];
    if (
      !permissionDomainId.eq(proofs[0][0]) ||
      !childSkillIndex.eq(proofs[0][1])
    ) {
      throw new Error(
        `${address} has to have all required roles (${roles}) in the same domain`,
      );
    }
  }
  // It does not need to be an array because if we get here, all the proofs are the same
  return proofs[0];
}
