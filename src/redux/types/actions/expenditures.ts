import { ActionTypes } from '~redux/actionTypes';
import { Address, Colony, Domain, Expenditure, ExpenditureSlot } from '~types';
import {
  ExpenditurePayoutFieldValue,
  ExpenditureStageFieldValue,
} from '~common/Expenditures/ExpenditureForm';
import { StreamingPaymentEndCondition } from '~gql';

import { UniqueActionType, ErrorActionType, MetaWithSetter } from './index';

export type ExpenditureFundPayload = {
  colonyAddress: Address;
  fromDomainFundingPotId: number;
  expenditure: Expenditure;
};

export type StakedExpenditureCancelPayload = {
  colonyAddress: Address;
  stakedExpenditureAddress: string;
  shouldPunish: boolean;
  expenditure: Expenditure;
};

export type ExpendituresActionTypes =
  | UniqueActionType<
      ActionTypes.EXPENDITURE_CREATE,
      {
        colony: Colony;
        payouts: ExpenditurePayoutFieldValue[];
        // the domain to create the expenditure in
        createdInDomain: Domain;
        // id of the domain to fund the expenditure from
        fundFromDomainId: number;
        isStaged?: boolean;
        stages?: ExpenditureStageFieldValue[];
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_CREATE_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_CREATE_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_LOCK,
      {
        colonyName: string;
        colonyAddress: Address;
        nativeExpenditureId: string;
      },
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_LOCK_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_LOCK_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_FINALIZE,
      {
        colonyName: string;
        colonyAddress: Address;
        nativeExpenditureId: number;
      },
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_FINALIZE_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_FINALIZE_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_FUND,
      ExpenditureFundPayload,
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_FUND_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_FUND_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_EDIT,
      {
        colonyAddress: Address;
        expenditure: Expenditure;
        payouts: ExpenditurePayoutFieldValue[];
      },
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_EDIT_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_EDIT_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_DRAFT_CANCEL,
      {
        colonyAddress: Address;
        expenditure: Expenditure;
        stakedExpenditureAddress?: Address;
      },
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_DRAFT_CANCEL_ERROR, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_DRAFT_CANCEL_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.EXPENDITURE_CLAIM,
      {
        colonyAddress: Address;
        expenditureId: number;
        claimableSlots: ExpenditureSlot[];
      },
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_CLAIM_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_CLAIM_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.STAKED_EXPENDITURE_CREATE,
      {
        colony: Colony;
        payouts: ExpenditurePayoutFieldValue[];
        // the domain to create the expenditure in
        createdInDomain: Domain;
        // id of the domain to fund the expenditure from
        fundFromDomainId: number;
        stakeAmount: string;
        stakedExpenditureAddress: Address;
        isStaged?: boolean;
        stages?: ExpenditureStageFieldValue[];
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.STAKED_EXPENDITURE_CREATE_ERROR, object>
  | UniqueActionType<
      ActionTypes.STAKED_EXPENDITURE_CREATE_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.RECLAIM_EXPENDITURE_STAKE,
      {
        colonyAddress: Address;
        nativeExpenditureId: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.RECLAIM_EXPENDITURE_STAKE_ERROR, object>
  | UniqueActionType<
      ActionTypes.RECLAIM_EXPENDITURE_STAKE_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.RELEASE_EXPENDITURE_STAGE,
      {
        colonyAddress: Address;
        expenditure: Expenditure;
        slotId: number;
        tokenAddresses: Address[];
        stagedExpenditureAddress: Address;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.RELEASE_EXPENDITURE_STAGE_ERROR, object>
  | UniqueActionType<
      ActionTypes.RELEASE_EXPENDITURE_STAGE_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.STAKED_EXPENDITURE_CANCEL,
      StakedExpenditureCancelPayload,
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.STAKED_EXPENDITURE_CANCEL_ERROR, object>
  | UniqueActionType<
      ActionTypes.STAKED_EXPENDITURE_CANCEL_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.STREAMING_PAYMENT_CREATE,
      {
        colonyAddress: Address;
        createdInDomain: Domain;
        recipientAddress: Address;
        tokenAddress: Address;
        amount: string;
        startTime: number;
        endTime?: number;
        interval: number;
        endCondition: StreamingPaymentEndCondition;
        limitAmount?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.STREAMING_PAYMENT_CREATE_ERROR, object>
  | UniqueActionType<
      ActionTypes.STREAMING_PAYMENT_CREATE_SUCCESS,
      object,
      object
    >;
