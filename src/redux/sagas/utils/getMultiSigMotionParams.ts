import {
  ClientType,
  type ColonyRole,
  Id,
  type AnyColonyClient,
} from '@colony/colony-js';
import { call } from 'redux-saga/effects';

import { ADDRESS_ZERO } from '~constants';
import { type ColonyRoleFragment } from '~gql';
import { type Domain } from '~types/graphql.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import { getPermissionProofsLocal } from './proofs.ts';

interface IGetMultiSigMotionParams {
  permissionAddress?: string;
  colonyClient: AnyColonyClient;
  colonyAddress: string;
  colonyRoles: ColonyRoleFragment[];
  colonyDomains: Domain[];
  requiredColonyRoles: ColonyRole[][];
  encodedAction: string;
  isMultiSig?: boolean;
  group: {
    key: string;
    id: string;
    index: number;
  };
  ready?: boolean;
  requiredDomainId?: Id;
  targetAddressOverride?: string;
}

/**
 * @TODO Sagas that can easily benefit from this:
 * - editColonyMotion
 * - manageTokens
 * - manageVerifiedMembers
 * - rootMotion
 */
function* getMultiSigMotionParams({
  permissionAddress,
  colonyClient,
  colonyAddress,
  colonyDomains,
  colonyRoles,
  requiredColonyRoles,
  encodedAction,
  isMultiSig = true,
  group,
  ready = false,
  requiredDomainId = Id.RootDomain,
  targetAddressOverride,
}: IGetMultiSigMotionParams) {
  const { networkClient, signer } = colonyClient;

  const finalPermissionAddress =
    permissionAddress ?? (yield signer.getAddress());

  const [permissionDomainId, childSkillIndex] = yield call(
    getPermissionProofsLocal,
    {
      networkClient,
      colonyRoles,
      colonyDomains,
      requiredDomainId,
      requiredColonyRoles,
      permissionAddress: finalPermissionAddress,
      isMultiSig,
    },
  );

  return {
    context: ClientType.MultisigPermissionsClient,
    methodName: TRANSACTION_METHODS.CreateMotion,
    identifier: colonyAddress,
    params: [
      permissionDomainId,
      childSkillIndex,
      [targetAddressOverride ?? ADDRESS_ZERO],
      [encodedAction],
    ],
    group,
    ready,
  };
}

export default getMultiSigMotionParams;
