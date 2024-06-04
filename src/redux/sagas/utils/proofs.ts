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

import { type ColonyManager } from '~context/index.ts';
import { type ColonyRoleFragment } from '~gql';
import { getUserRolesForDomain } from '~transformers';
import { type Domain } from '~types/graphql.ts';

import getColonyManager from './getColonyManager.ts';

export async function getChildIndexLocal(
  networkClient: ColonyNetworkClient,
  parentDomainNativeId: BigNumberish,
  parentDomainSkillId: BigNumberish,
  domainNativeId: BigNumberish,
  domainSkillId: BigNumberish,
): Promise<BigNumber> {
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

const getSinglePermissionProofsLocal = async (
  networkClient: ColonyNetworkClient,
  colonyRoles: ColonyRoleFragment[],
  colonyDomains: Domain[],
  requiredDomainId: number,
  requiredColonyRole: ColonyRole,
  permissionAddress: string,
  isMultiSig: boolean,
  /* [permissionDomainId, childSkillIndex, permissionAddress] */
): Promise<[BigNumber, BigNumber, string]> => {
  const userRolesInDomain = getUserRolesForDomain(
    colonyRoles,
    permissionAddress,
    requiredDomainId,
    true,
    isMultiSig,
  );
  const userRolesInRoot = getUserRolesForDomain(
    colonyRoles,
    permissionAddress,
    Id.RootDomain,
    true,
    isMultiSig,
  );

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

  const idx = await getChildIndexLocal(
    networkClient,
    foundDomainId,
    rootDomain.nativeSkillId,
    permissionDomain.nativeId,
    permissionDomain.nativeSkillId,
  );

  if (idx.lt(0)) {
    throw new Error(
      `${permissionAddress} does not have the permission ${requiredColonyRole} in any parent domain`,
    );
  }
  return [foundDomainId, idx, permissionAddress];
};

const getMultiPermissionProofsLocal = async (
  networkClient: ColonyNetworkClient,
  colonyRoles: ColonyRoleFragment[],
  colonyDomains: Domain[],
  requiredDomainId: number,
  requiredColonyRoles: ColonyRole[],
  permissionAddress: string,
  isMultiSig: boolean,
): Promise<[BigNumber, BigNumber, string]> => {
  const proofs = await Promise.all(
    requiredColonyRoles.map((role) =>
      getSinglePermissionProofsLocal(
        networkClient,
        colonyRoles,
        colonyDomains,
        requiredDomainId,
        role,
        permissionAddress,
        isMultiSig,
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
        `${address} has to have all required roles (${requiredColonyRoles}) in the same domain`,
      );
    }
  }

  // It does not need to be an array because if we get here, all the proofs are the same
  return proofs[0];
};

export const getPermissionProofsLocal = async (
  networkClient: ColonyNetworkClient,
  colonyRoles: ColonyRoleFragment[],
  colonyDomains: Domain[],
  requiredDomainId: number,
  requiredColonyRole: ColonyRole | ColonyRole[],
  permissionAddress: string,
  isMultiSig: boolean,
): Promise<[BigNumber, BigNumber, string]> => {
  if (Array.isArray(requiredColonyRole)) {
    if (requiredColonyRole.length === 1) {
      return getSinglePermissionProofsLocal(
        networkClient,
        colonyRoles,
        colonyDomains,
        requiredDomainId,
        requiredColonyRole[0],
        permissionAddress,
        isMultiSig,
      );
    }
    return getMultiPermissionProofsLocal(
      networkClient,
      colonyRoles,
      colonyDomains,
      requiredDomainId,
      requiredColonyRole,
      permissionAddress,
      isMultiSig,
    );
  }
  return getSinglePermissionProofsLocal(
    networkClient,
    colonyRoles,
    colonyDomains,
    requiredDomainId,
    requiredColonyRole,
    permissionAddress,
    isMultiSig,
  );
};

export function* getMoveFundsPermissionProofs(
  colonyAddress: string,
  fromtPotId: BigNumberish,
  toPotId: BigNumberish,
) {
  const colonyManager: ColonyManager = yield getColonyManager();

  const { signer } = colonyManager;
  const walletAddress = yield signer.getAddress();

  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const fromDomainId = yield getPotDomain(colonyClient, fromtPotId);
  const toDomainId = yield getPotDomain(colonyClient, toPotId);
  const [fromPermissionDomainId, fromChildSkillIndex] =
    yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      fromDomainId,
      ColonyRole.Funding,
      walletAddress,
    );
  // @TODO: once getPermissionProofs is more expensive we can just check the domain here
  // with userHasRole and then immediately get the permission proofs
  const [toPermissionDomainId, toChildSkillIndex] = yield getPermissionProofs(
    colonyClient.networkClient,
    colonyClient,
    toDomainId,
    ColonyRole.Funding,
    walletAddress,
  );
  // Here's a weird case. We have found permissions for these domains but they don't share
  // a parent domain with that permission. We can still find a common parent domain that
  // has the funding permission
  if (!fromPermissionDomainId.eq(toPermissionDomainId)) {
    const hasFundingInRoot = yield colonyClient.hasUserRole(
      walletAddress,
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
