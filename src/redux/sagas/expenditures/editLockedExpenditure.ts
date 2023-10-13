import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux';
import { ColonyManager } from '~context';

import {
  putError,
  initiateTransaction,
  getColonyManager,
  getResolvedExpenditurePayouts,
  takeFrom,
  getMulticallDataForPayout,
} from '../utils';
import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions';

function* editLockedExpenditure({
  payload: { colonyAddress, expenditure, payouts },
  meta,
}: Action<ActionTypes.EXPENDITURE_LOCKED_EDIT>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const txChannel = yield call(getTxChannel, meta.id);

  const resolvedPayouts = getResolvedExpenditurePayouts(expenditure, payouts);

  try {
    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient,
      expenditure.nativeDomainId,
      ColonyRole.Administration,
    );

    const encodedMulticallData: string[] = resolvedPayouts.flatMap((payout) =>
      getMulticallDataForPayout(
        expenditure,
        payout,
        colonyClient,
        permissionDomainId,
        childSkillIndex,
      ),
    );

    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'multicall',
      identifier: colonyAddress,
      params: [encodedMulticallData],
      title: { id: 'transaction.multicall.setExpenditureState.title' },
      /**
       * @NOTE Although there's only one transaction, this group is needed here as
       * it's a workaround to override the transaction title and description
       */
      group: {
        key: 'multicall',
        id: meta.id,
        index: 0,
        title: { id: 'transaction.multicall.setExpenditureState.title' },
        description: {
          id: 'transaction.multicall.setExpenditureState.description',
        },
      },
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction({ id: meta.id });

    const { type } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<AllActions>({
        type: ActionTypes.EXPENDITURE_LOCKED_EDIT_SUCCESS,
        payload: {},
        meta,
      });
    }
  } catch (error) {
    console.error(error);
    return yield putError(
      ActionTypes.EXPENDITURE_LOCKED_EDIT_ERROR,
      error,
      meta,
    );
  }

  txChannel.close();

  return null;
}

export default function* editLockedExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_LOCKED_EDIT, editLockedExpenditure);
}
