import { ActionTypes } from '~redux/actionTypes';
import { Address, Colony, Expenditure } from '~types';
import { ExpenditurePayoutFieldValue } from '~common/Expenditures/ExpenditureForm';

import { UniqueActionType, ErrorActionType, MetaWithNavigate } from './index';

export type ExpendituresActionTypes =
  | UniqueActionType<
      ActionTypes.EXPENDITURE_CREATE,
      {
        colony: Colony;
        payouts: ExpenditurePayoutFieldValue[];
        domainId: number;
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
        nativeExpenditureId: string;
      },
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_FINALIZE_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_FINALIZE_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_FUND,
      {
        colonyAddress: Address;
        fromDomainFundingPotId: number;
        expenditure: Expenditure;
      },
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
  | UniqueActionType<ActionTypes.EXPENDITURE_EDIT_SUCCESS, object, object>;
