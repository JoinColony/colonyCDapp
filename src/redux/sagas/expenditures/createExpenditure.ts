import { ClientType } from '@colony/colony-js';
import { takeEvery, fork, call, put } from 'redux-saga/effects';
import { BigNumber } from 'ethers';

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
import { DEFAULT_TOKEN_DECIMALS } from '~constants';

import {
  ChannelDefinition,
  createTransaction,
  createTransactionChannels,
} from '../transactions';
import {
  getColonyManager,
  putError,
  takeFrom,
  groupExpenditurePayoutsByTokenAddresses,
} from '../utils';

function* createExpenditure({
  meta: { id: metaId, navigate },
  meta,
  payload: {
    colony: { name: colonyName, colonyAddress },
    payouts,
    domainId,
  },
}: Action<ActionTypes.EXPENDITURE_CREATE>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );
  const apolloClient = getContext(ContextModule.ApolloClient);

  const batchKey = 'createExpenditure';

  // Group payouts by token addresses
  const payoutsByTokenAddresses =
    groupExpenditurePayoutsByTokenAddresses(payouts);

  const {
    makeExpenditure,
    setExpenditureValues,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    metaId,
    ['makeExpenditure', 'setExpenditureValues'],
  );

  try {
    yield fork(createTransaction, makeExpenditure.id, {
      context: ClientType.ColonyClient,
      methodName: 'makeExpenditure',
      identifier: colonyAddress,
      params: [1, BigNumber.from(2).pow(256).sub(1), 1],
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
      transactionAddParams(setExpenditureValues.id, [
        expenditureId,
        // slot ids for recipients
        payouts.map((payout) => payout.slotId),
        // recipient addresses
        payouts.map((payout) => payout.recipientAddress),
        // slot ids for skill ids
        [],
        // skill ids
        [],
        // slot ids for claim delays
        [],
        // claim delays
        [],
        // slot ids for payout modifiers
        [],
        // payout modifiers
        [],
        // token addresses
        [...payoutsByTokenAddresses.keys()],
        // 2-dimensional array mapping token addresses to slot ids
        [...payoutsByTokenAddresses.values()].map((payoutsByTokenAddress) =>
          payoutsByTokenAddress.map((payout) => payout.slotId),
        ),
        // 2-dimensional array mapping token addresses to amounts
        [...payoutsByTokenAddresses.values()].map((payoutsByTokenAddress) =>
          payoutsByTokenAddress.map((payout) =>
            BigNumber.from(payout.amount).mul(
              // @TODO: This should get the token decimals of the selected token
              BigNumber.from(10).pow(DEFAULT_TOKEN_DECIMALS),
            ),
          ),
        ),
      ]),
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
          nativeDomainId: domainId,
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
