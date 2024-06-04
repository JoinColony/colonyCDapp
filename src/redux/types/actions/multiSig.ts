import { type BigNumber } from 'ethers';

import { type UserRole } from '~constants/permissions.ts';
import { type ColonyRoleFragment, type MultiSigVote } from '~gql';
import { type Domain } from '~types/graphql.ts';
import { type Address } from '~types/index.ts';

import { type ActionTypes } from '../../actionTypes.ts';

import {
  type MetaWithSetter,
  type ErrorActionType,
  type UniqueActionType,
  type UniqueActionTypeWithoutPayload,
  type ActionTypeWithMeta,
} from './index.ts';

export enum RootMultiSigMethodNames {
  MintTokens = 'mintTokens',
  Upgrade = 'upgrade',
  UnlockToken = 'unlockToken',
}
type DomainThreshold = {
  skillId: number;
  threshold: number;
};

export type MultiSigActionTypes =
  | UniqueActionType<
      ActionTypes.MULTISIG_SET_THRESHOLDS,
      {
        colonyAddress: Address;
        globalThreshold: number;
        domainThresholds: DomainThreshold[];
      },
      object
    >
  | ErrorActionType<ActionTypes.MULTISIG_SET_THRESHOLDS_ERROR, object>
  | UniqueActionTypeWithoutPayload<
      ActionTypes.MULTISIG_SET_THRESHOLDS_SUCCESS,
      object
    >
  | UniqueActionType<
      ActionTypes.MULTISIG_VOTE,
      {
        colonyAddress: Address;
        colonyDomains: Domain[];
        colonyRoles: ColonyRoleFragment[];
        vote: MultiSigVote;
        domainId: number;
        requiredRole: UserRole;
        multiSigId: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MULTISIG_VOTE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MULTISIG_VOTE_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MULTISIG_FINALIZE,
      {
        colonyAddress: Address;
        multiSigId: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MULTISIG_FINALIZE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MULTISIG_FINALIZE_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.ROOT_MULTISIG,
      {
        operationName: RootMultiSigMethodNames;
        customActionTitle: string;
        colonyAddress: Address;
        colonyDomains: Domain[];
        colonyRoles: ColonyRoleFragment[];
        colonyName?: string;
        domainId?: number;
        multiSigParams: [BigNumber] | [string];
        annotationMessage?: string;
        requiredRole: UserRole;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ROOT_MULTISIG_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ROOT_MULTISIG_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MULTISIG_CANCEL,
      {
        colonyAddress: Address;
        motionId: string;
      },
      object
    >
  | ErrorActionType<ActionTypes.MULTISIG_CANCEL_ERROR, object>
  | UniqueActionTypeWithoutPayload<ActionTypes.MULTISIG_CANCEL_SUCCESS, object>;
