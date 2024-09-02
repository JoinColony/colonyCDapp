import {
  ColonyRole,
  Id,
  ClientType,
  getPotDomain,
  getPermissionProofs,
  getChildIndex,
  type ColonyNetworkClient,
} from '@colony/colony-js';
import { BigNumber, constants, type BigNumberish } from 'ethers';
import { call } from 'redux-saga/effects';

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

export function* getMoveFundsPermissionProofs({
  colonyAddress,
  fromPotId,
  toPotId,
  colonyDomains,
  colonyRoles,
}: {
  colonyAddress: string;
  fromPotId: BigNumberish;
  toPotId: BigNumberish;
  colonyDomains: Domain[];
  colonyRoles: ColonyRoleFragment[];
}) {
  const colonyManager: ColonyManager = yield getColonyManager();

  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const userAddress = yield colonyClient.signer.getAddress();

  const fromDomainId: BigNumberish = yield getPotDomain(
    colonyClient,
    fromPotId,
  );
  const toDomainId: BigNumberish = yield getPotDomain(colonyClient, toPotId);

  const [fromPermissionDomainId, fromChildSkillIndex] = yield call(
    getPermissionProofsLocal,
    {
      networkClient: colonyClient.networkClient,
      colonyRoles,
      colonyDomains,
      requiredDomainId: Number(fromDomainId),
      requiredColonyRoles: ColonyRole.Funding,
      permissionAddress: userAddress,
    },
  );

  const [toPermissionDomainId, toChildSkillIndex] = yield call(
    getPermissionProofsLocal,
    {
      networkClient: colonyClient.networkClient,
      colonyRoles,
      colonyDomains,
      requiredDomainId: Number(toDomainId),
      requiredColonyRoles: ColonyRole.Funding,
      permissionAddress: userAddress,
    },
  );
  // Here's a weird case. We have found permissions for these domains but they don't share
  // a parent domain with that permission. We can still find a common parent domain that
  // has the funding permission
  if (!fromPermissionDomainId.eq(toPermissionDomainId)) {
    const hasFundingInRoot = yield colonyClient.hasUserRole(
      userAddress,
      Id.RootDomain,
      ColonyRole.Funding,
    );
    // @TODO: In the future we have to not only check the ROOT domain but traverse the tree
    // (binary search) to find a common parent domain with funding permission
    // ALTHOUGH there might not be a colony version that supports the old
    // moveFundsBetweenPots function AND nested domains
    if (hasFundingInRoot) {
      const rootFromChildSkillIndex = yield getChildIndex(
        colonyClient.networkClient,
        colonyClient,
        Id.RootDomain,
        fromDomainId,
      );
      const rootToChildSkillIndex = yield getChildIndex(
        colonyClient.networkClient,
        colonyClient,
        Id.RootDomain,
        toDomainId,
      );
      // This shouldn't really happen as we have already checked whether the user has funding
      if (rootFromChildSkillIndex.lt(0) || rootToChildSkillIndex.lt(0)) {
        throw new Error(
          `User does not have the funding permission in any parent domain`,
        );
      }
      return [
        fromPermissionDomainId,
        rootFromChildSkillIndex,
        rootToChildSkillIndex,
      ];
    }
    throw new Error(
      'User has to have the funding role in a domain that both associated pots a children of',
    );
  }
  return [fromPermissionDomainId, fromChildSkillIndex, toChildSkillIndex];
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

interface GetSinglePermissionProofsFromSourceDomainParams {
  networkClient: ColonyNetworkClient;
  colonyRoles: ColonyRoleFragment[];
  colonyDomains: Domain[];
  requiredDomainId: number;
  requiredColonyRole: ColonyRole;
  permissionAddress: string;
  isMultiSig?: boolean;
}

// Returns the permission proofs from the domain where the user has been assigned the permissions
// If the user has permissions directly in the requiredDomainId those will be returned first
// However, if the user has inherited permissions in the requiredDomainId,
// the permission proofs will be returned from the domain from which they are inherited
export const getSinglePermissionProofsFromSourceDomain = async ({
  networkClient,
  colonyRoles,
  colonyDomains,
  requiredDomainId,
  requiredColonyRole,
  permissionAddress,
  isMultiSig = false,
}: GetSinglePermissionProofsFromSourceDomainParams): Promise<
  [BigNumber, BigNumber, string]
> => {
  const [permissionDomainId, childSkillIndex] =
    await getSinglePermissionProofsLocal({
      networkClient,
      colonyRoles,
      colonyDomains,
      requiredDomainId,
      requiredColonyRole,
      permissionAddress,
      isMultiSig,
    });

  if (Number(permissionDomainId) === requiredDomainId) {
    return [permissionDomainId, childSkillIndex, permissionAddress];
  }

  // Once nested teams is implemented, this should get from the next parent, then work it's way up the tree to root
  const [rootPermissionDomainId, rootChildSkillIndex] =
    await getSinglePermissionProofsLocal({
      networkClient,
      colonyRoles,
      colonyDomains,
      requiredDomainId: Id.RootDomain,
      requiredColonyRole,
      permissionAddress,
      isMultiSig,
    });

  return [rootPermissionDomainId, rootChildSkillIndex, permissionAddress];
};
