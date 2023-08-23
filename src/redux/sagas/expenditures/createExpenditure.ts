import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { takeEvery, fork, call, put } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux';
import { ColonyManager, ContextModule, getContext } from '~context';
import {
  transactionAddParams,
  transactionPending,
  transactionReady,
} from '~redux/actionCreators';
import {
  CreateExpenditureMetadataDocument,
  CreateExpenditureMetadataMutation,
  CreateExpenditureMetadataMutationVariables,
} from '~gql';
import { getExpenditureDatabaseId } from '~utils/databaseId';
import { toNumber } from '~utils/numbers';

import {
  ChannelDefinition,
  createTransaction,
  createTransactionChannels,
} from '../transactions';
import {
  getColonyManager,
  putError,
  takeFrom,
  getSetExpenditureValuesFunctionParams,
} from '../utils';

function* createExpenditure({
  meta: { id: metaId, navigate },
  meta,
  payload: {
    colony: { name: colonyName, colonyAddress },
    payouts,
    domainId,
    fundFromDomainId,
  },
}: Action<ActionTypes.EXPENDITURE_CREATE>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );
  const apolloClient = getContext(ContextModule.ApolloClient);

  const batchKey = 'createExpenditure';

  // Add slot id to each payout
  const payoutsWithSlotIds = payouts.map((payout, index) => ({
    ...payout,
    slotId: index + 1,
  }));

  const {
    makeExpenditure,
    setExpenditureValues,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    metaId,
    ['makeExpenditure', 'setExpenditureValues'],
  );

  try {
    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient,
      domainId,
      ColonyRole.Administration,
    );

    yield fork(createTransaction, makeExpenditure.id, {
      context: ClientType.ColonyClient,
      methodName: 'makeExpenditure',
      identifier: colonyAddress,
      params: [permissionDomainId, childSkillIndex, domainId],
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      ready: false,
    });

    yield fork(createTransaction, setExpenditureValues.id, {
      context: ClientType.ColonyClient,
      methodName: 'setExpenditureValues',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 1,
      },
      ready: false,
    });

    yield put(transactionPending(makeExpenditure.id));
    yield put(transactionReady(makeExpenditure.id));
    yield takeFrom(makeExpenditure.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    const expenditureId = yield call(colonyClient.getExpenditureCount);

    yield put(transactionPending(setExpenditureValues.id));
    yield put(
      transactionAddParams(
        setExpenditureValues.id,
        getSetExpenditureValuesFunctionParams(
          expenditureId,
          payoutsWithSlotIds,
        ),
      ),
    );
    yield put(transactionReady(setExpenditureValues.id));
    yield takeFrom(
      setExpenditureValues.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    yield apolloClient.mutate<
      CreateExpenditureMetadataMutation,
      CreateExpenditureMetadataMutationVariables
    >({
      mutation: CreateExpenditureMetadataDocument,
      variables: {
        input: {
          id: getExpenditureDatabaseId(colonyAddress, toNumber(expenditureId)),
          fundFromDomainNativeId: fundFromDomainId,
        },
      },
    });

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_CREATE_SUCCESS,
      payload: {},
      meta,
    });

    navigate(`/colony/${colonyName}/expenditures/${expenditureId}`);
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_CREATE_ERROR, error, meta);
  }

  [makeExpenditure, setExpenditureValues].forEach((channel) =>
    channel.channel.close(),
  );

  return null;
}

export default function* createExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_CREATE, createExpenditure);
}
