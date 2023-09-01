import { ClientType, Id, getChildIndex } from '@colony/colony-js';
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
  ExpenditureType,
} from '~gql';
import { getExpenditureDatabaseId } from '~utils/databaseId';
import { toNumber } from '~utils/numbers';
import { ADDRESS_ZERO } from '~constants';

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

function* createStakedExpenditure({
  meta: { navigate },
  meta,
  payload: {
    colony: { name: colonyName, colonyAddress },
    payouts,
    createdInDomain,
    fundFromDomainId,
    stakeAmount,
    stakedExpenditureAddress,
  },
}: Action<ActionTypes.STAKED_EXPENDITURE_CREATE>) {
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
    approveStake,
    makeExpenditure,
    setExpenditureValues,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['approveStake', 'makeExpenditure', 'setExpenditureValues'],
  );

  try {
    yield fork(createTransaction, approveStake.id, {
      context: ClientType.ColonyClient,
      methodName: 'approveStake',
      identifier: colonyAddress,
      params: [stakedExpenditureAddress, createdInDomain.nativeId, stakeAmount],
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      ready: false,
    });

    yield fork(createTransaction, makeExpenditure.id, {
      context: ClientType.StakedExpenditureClient,
      methodName: 'makeExpenditureWithStake',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 1,
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
        index: 2,
      },
      ready: false,
    });

    yield put(transactionPending(approveStake.id));
    yield put(transactionReady(approveStake.id));
    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    // Find a chill skill index as a proof the extension has permissions in the selected domain
    const childSkillIndex = yield getChildIndex(
      colonyClient,
      // StakedExpenditure extension will always have its permissions assigned in the root domain
      Id.RootDomain,
      createdInDomain.nativeId,
    );

    // Get reputation proof for the selected domain
    const {
      key: reputationKey,
      value: reputationValue,
      branchMask,
      siblings,
    } = yield colonyClient.getReputation(
      createdInDomain.nativeSkillId,
      ADDRESS_ZERO,
    );

    yield put(transactionPending(makeExpenditure.id));
    yield put(
      transactionAddParams(makeExpenditure.id, [
        Id.RootDomain,
        childSkillIndex,
        createdInDomain.nativeId,
        reputationKey,
        reputationValue,
        branchMask,
        siblings,
      ]),
    );
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
          type: ExpenditureType.Staked,
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

  [approveStake, makeExpenditure, setExpenditureValues].forEach((channel) =>
    channel.channel.close(),
  );

  return null;
}

export default function* createStakedExpenditureSaga() {
  yield takeEvery(
    ActionTypes.STAKED_EXPENDITURE_CREATE,
    createStakedExpenditure,
  );
}
