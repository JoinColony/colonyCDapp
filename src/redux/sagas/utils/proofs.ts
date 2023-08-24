import {
  ColonyRole,
  Id,
  ClientType,
  getPotDomain,
  getPermissionProofs,
  getChildIndex,
} from '@colony/colony-js';

import { ColonyManager } from '~context';
import getColonyManager from './getColonyManager';

export function* getMoveFundsPermissionProofs(
  colonyAddress,
  fromtPotId,
  toPotId,
) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const { signer } = colonyManager;

  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const walletAddress = yield signer.getAddress();

  const fromDomainId = yield getPotDomain(colonyClient, fromtPotId);
  const toDomainId = yield getPotDomain(colonyClient, toPotId);
  const [fromPermissionDomainId, fromChildSkillIndex] =
    yield getPermissionProofs(
      colonyClient,
      fromDomainId,
      ColonyRole.Funding,
      walletAddress,
    );
  // @TODO: once getPermissionProofs is more expensive we can just check the domain here
  // with userHasRole and then immediately get the permission proofs
  const [toPermissionDomainId, toChildSkillIndex] = yield getPermissionProofs(
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
        colonyClient,
        Id.RootDomain,
        fromDomainId,
      );
      const rootToChildSkillIndex = yield getChildIndex(
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
      // eslint-disable-next-line max-len
      'User has to have the funding role in a domain that both associated pots a children of',
    );
  }
  return [fromPermissionDomainId, fromChildSkillIndex, toChildSkillIndex];
}
