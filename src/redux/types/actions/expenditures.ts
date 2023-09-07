import { ActionTypes } from '~redux/actionTypes';
import { Address, Colony, Domain, Expenditure, ExpenditureSlot } from '~types';
import {
  ExpenditurePayoutFieldValue,
  ExpenditureStageFieldValue,
} from '~common/Expenditures/ExpenditureForm';

import { UniqueActionType, ErrorActionType, MetaWithNavigate } from './index';

export type ExpenditureFundPayload = {
  colonyAddress: Address;
  fromDomainFundingPotId: number;
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
        isStaged: boolean;
        stages: ExpenditureStageFieldValue[];
      },
      MetaWithNavigate<object>
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
      ActionTypes.EXPENDITURE_CANCEL,
      {
        colonyAddress: Address;
        nativeExpenditureId: number;
      },
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_CANCEL_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_CANCEL_SUCCESS, object, object>
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
        isStaged: boolean;
        stages: ExpenditureStageFieldValue[];
      },
      MetaWithNavigate<object>
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
      MetaWithNavigate<object>
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
      MetaWithNavigate<object>
    >
  | ErrorActionType<ActionTypes.RELEASE_EXPENDITURE_STAGE_ERROR, object>
  | UniqueActionType<
      ActionTypes.RELEASE_EXPENDITURE_STAGE_SUCCESS,
      object,
      object
    >;
