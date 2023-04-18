import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

// import { ContextModule, getContext } from '~context';
import { Action, ActionTypes, AllActions } from '~redux';

import { createTransaction, createTransactionChannels, getTxChannel } from '../transactions';
import { transactionReady } from '../../actionCreators';
import { putError, takeFrom } from '../utils';

function* createMoveFundsAction({
  payload: {
    colonyAddress,
    colonyName,
    fromDomain,
    toDomain,
    amount,
    tokenAddress,
    // annotationMessage,
  },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.ACTION_MOVE_FUNDS>) {
  let txChannel;
  try {
    // const apolloClient = getContext(ContextModule.ApolloClient);

    /*
     * Validate the required values for the payment
     */
    if (!fromDomain) {
      throw new Error('Source domain not set for oveFundsBetweenPots transaction');
    }
    if (!toDomain) {
      throw new Error('Recipient domain not set for MoveFundsBetweenPots transaction');
    }
    if (!amount) {
      throw new Error('Payment amount not set for MoveFundsBetweenPots transaction');
    }
    if (!tokenAddress) {
      throw new Error('Payment token not set for MoveFundsBetweenPots transaction');
    }

    const { nativeFundingPotId: fromPot } = fromDomain;
    const { nativeFundingPotId: toPot } = toDomain;

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'moveFunds';

    const { moveFunds /* annotateMoveFunds */ } = yield createTransactionChannels(metaId, [
      'moveFunds',
      // 'annotateMoveFunds',
    ]);

    yield fork(createTransaction, moveFunds.id, {
      context: ClientType.ColonyClient,
      methodName: 'moveFundsBetweenPotsWithProofs(uint256,uint256,uint256,address)',
      identifier: colonyAddress,
      params: [fromPot, toPot, amount, tokenAddress],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    // if (annotationMessage) {
    //   yield fork(createTransaction, annotateMoveFunds.id, {
    //     context: ClientType.ColonyClient,
    //     methodName: 'annotateTransaction',
    //     identifier: colonyAddress,
    //     params: [],
    //     group: {
    //       key: batchKey,
    //       id: metaId,
    //       index: 1,
    //     },
    //     ready: false,
    //   });
    // }

    yield takeFrom(moveFunds.channel, ActionTypes.TRANSACTION_CREATED);
    // if (annotationMessage) {
    //   yield takeFrom(
    //     annotateMoveFunds.channel,
    //     ActionTypes.TRANSACTION_CREATED,
    //   );
    // }

    yield put(transactionReady(moveFunds.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(moveFunds.channel, ActionTypes.TRANSACTION_HASH_RECEIVED);

    yield takeFrom(moveFunds.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    // if (annotationMessage) {
    //   yield put(transactionPending(annotateMoveFunds.id));

    //   const ipfsHash = yield call(uploadIfpsAnnotation, annotationMessage);

    //   yield put(transactionAddParams(annotateMoveFunds.id, [txHash, ipfsHash]));

    //   yield put(transactionReady(annotateMoveFunds.id));

    //   yield takeFrom(
    //     annotateMoveFunds.channel,
    //     ActionTypes.TRANSACTION_SUCCEEDED,
    //   );
    // }

    // // Refetch token balances for the domains involved
    // yield apolloClient.query<
    //   TokenBalancesForDomainsQuery,
    //   TokenBalancesForDomainsQueryVariables
    // >({
    //   query: TokenBalancesForDomainsDocument,
    //   variables: {
    //     colonyAddress,
    //     tokenAddresses: [tokenAddress],
    //     domainIds: [fromDomainId, toDomainId],
    //   },
    //   // Force resolvers to update, as query resolvers are only updated on a cache miss
    //   // See #4: https://www.apollographql.com/docs/link/links/state/#resolvers
    //   // Also: https://www.apollographql.com/docs/react/api/react-apollo/#optionsfetchpolicy
    //   fetchPolicy: 'network-only',
    // });

    yield put<AllActions>({
      type: ActionTypes.ACTION_MOVE_FUNDS_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      yield navigate(`/colony/${colonyName}/tx/${txHash}`);
    }
  } catch (caughtError) {
    putError(ActionTypes.ACTION_MOVE_FUNDS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* moveFundsActionSaga() {
  yield takeEvery(ActionTypes.ACTION_MOVE_FUNDS, createMoveFundsAction);
}
