import { BigNumber } from 'ethers';
import { ColonyRole } from '@colony/colony-js';

import { ActionTypes } from '../../actionTypes';
import { Address, DomainColor, RemoveTypeName } from '~types';

import {
  ErrorActionType,
  UniqueActionType,
  UniqueActionTypeWithoutPayload,
  ActionTypeWithMeta,
  MetaWithHistory,
  MetaWithNavigate,
} from './index';
import { MotionStakeFragment } from '~gql';

export enum RootMotionMethodNames {
  MintTokens = 'mintTokens',
  Upgrade = 'upgrade',
  UnlockToken = 'unlockToken',
}

export type MotionActionTypes =
  | UniqueActionType<
      ActionTypes.MOTION_STAKE,
      {
        userAddress: Address;
        colonyAddress: Address;
        motionId: BigNumber;
        vote: number;
        amount: BigNumber;
        annotationMessage?: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.MOTION_STAKE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_STAKE_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_VOTE,
      {
        userAddress: Address;
        colonyAddress: Address;
        motionId: BigNumber;
        vote: number;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.MOTION_VOTE_ERROR, object>
  | ActionTypeWithMeta<ActionTypes.MOTION_VOTE_SUCCESS, MetaWithHistory<object>>
  | UniqueActionType<
      ActionTypes.MOTION_REVEAL_VOTE,
      {
        userAddress: Address;
        colonyAddress: Address;
        motionId: BigNumber;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.MOTION_REVEAL_VOTE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_REVEAL_VOTE_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_FINALIZE,
      {
        userAddress: Address;
        colonyAddress: Address;
        motionId: BigNumber;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.MOTION_FINALIZE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_FINALIZE_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_CLAIM,
      {
        userAddress: Address;
        colonyAddress: Address;
        motionId: string;
        claims: Array<RemoveTypeName<MotionStakeFragment>>;
      },
      Record<string, any>
    >
  | ErrorActionType<ActionTypes.MOTION_CLAIM_ERROR, object>
  | ActionTypeWithMeta<ActionTypes.MOTION_CLAIM_SUCCESS, Record<string, any>>
  | UniqueActionType<
      ActionTypes.MOTION_CLAIM_ALL,
      {
        userAddress: Address;
        colonyAddress: Address;
        motionIds: Array<BigNumber>;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.MOTION_CLAIM_ALL_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_CLAIM_ALL_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_DOMAIN_CREATE_EDIT,
      {
        colonyAddress: Address;
        colonyName?: string;
        domainName: string;
        domainColor?: DomainColor;
        domainPurpose?: string;
        annotationMessage?: string;
        parentId?: number;
        domainId?: number;
        isCreateDomain: boolean;
        motionDomainId: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.MOTION_DOMAIN_CREATE_EDIT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_DOMAIN_CREATE_EDIT_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_EXPENDITURE_PAYMENT,
      {
        colonyAddress: Address;
        colonyName?: string;
        recipientAddress: Address;
        domainId: number;
        singlePayment: {
          amount: BigNumber;
          tokenAddress: Address;
          decimals: number;
        };
        annotationMessage?: string;
        motionDomainId: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.MOTION_EXPENDITURE_PAYMENT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_EXPENDITURE_PAYMENT_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_EDIT_COLONY,
      {
        colonyAddress: Address;
        colonyName: string;
        colonyDisplayName: string;
        colonyAvatarImage?: string;
        colonyAvatarHash?: string;
        hasAvatarChanged?: boolean;
        colonyTokens?: Address[];
        annotationMessage?: string;
        /*
         * @TODO I think this will also store the subscribed-to tokens list
         */
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.MOTION_EDIT_COLONY_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_EDIT_COLONY_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_MOVE_FUNDS,
      {
        colonyAddress: Address;
        colonyName?: string;
        version: string;
        tokenAddress: Address;
        fromDomainId: number;
        toDomainId: number;
        amount: BigNumber;
        annotationMessage?: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.MOTION_MOVE_FUNDS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_MOVE_FUNDS_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.ROOT_MOTION,
      {
        operationName: RootMotionMethodNames;
        colonyAddress: Address;
        colonyName?: string;
        motionParams: [BigNumber] | [string];
        annotationMessage?: string;
      },
      MetaWithNavigate<object>
    >
  | ErrorActionType<ActionTypes.ROOT_MOTION_ERROR, object>
  | ActionTypeWithMeta<ActionTypes.ROOT_MOTION_SUCCESS, MetaWithHistory<object>>
  | UniqueActionType<
      ActionTypes.MOTION_USER_ROLES_SET,
      {
        colonyAddress: Address;
        colonyName: string;
        domainId: number;
        userAddress: Address;
        roles: Record<ColonyRole, boolean>;
        annotationMessage?: string;
        motionDomainId: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.MOTION_USER_ROLES_SET_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_USER_ROLES_SET_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_STATE_UPDATE,
      {
        colonyAddress: Address;
        motionId: BigNumber;
        userAddress: Address;
      },
      object
    >
  | ErrorActionType<ActionTypes.MOTION_STATE_UPDATE_ERROR, object>
  | UniqueActionTypeWithoutPayload<
      ActionTypes.MOTION_STATE_UPDATE_SUCCESS,
      object
    >
  | UniqueActionType<
      ActionTypes.MOTION_ESCALATE,
      {
        userAddress: Address;
        colonyAddress: Address;
        motionId: BigNumber;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.MOTION_ESCALATE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_ESCALATE_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_MANAGE_REPUTATION,
      {
        colonyAddress: Address;
        colonyName?: string;
        domainId: number;
        userAddress: Address;
        amount: BigNumber;
        motionDomainId: string;
        annotationMessage?: string;
        isSmitingReputation?: boolean;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.MOTION_MANAGE_REPUTATION_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_MANAGE_REPUTATION_SUCCESS,
      MetaWithHistory<object>
    >;
