import { type ColonyRole } from '@colony/colony-js';

import { type ColonyRoleFragment, type MultiSigVote } from '~gql';
import { type ActionTypes } from '~redux/actionTypes.ts';
import { type Domain } from '~types/graphql.ts';
import { type Address } from '~types/index.ts';

import { type ExpenditureFundPayload } from './expenditures.ts';
import {
  type MetaWithSetter,
  type ErrorActionType,
  type UniqueActionType,
  type UniqueActionTypeWithoutPayload,
  type ActionTypeWithMeta,
} from './index.ts';

type DomainThreshold = {
  skillId: string;
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
        roles: ColonyRole[];
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
        canActionFail: boolean;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MULTISIG_FINALIZE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MULTISIG_FINALIZE_SUCCESS,
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
  | UniqueActionTypeWithoutPayload<ActionTypes.MULTISIG_CANCEL_SUCCESS, object>
  | UniqueActionType<
      ActionTypes.MULTISIG_EXPENDITURE_FUND,
      ExpenditureFundPayload,
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MULTISIG_EXPENDITURE_FUND_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MULTISIG_EXPENDITURE_FUND_SUCCESS,
      MetaWithSetter<object>
    >;
