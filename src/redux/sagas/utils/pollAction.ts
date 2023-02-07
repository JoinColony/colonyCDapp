import { ApolloQueryResult } from '@apollo/client';
import { call, delay, put, race, take } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context';
import { GetColonyActionDocument, GetColonyActionQuery } from '~gql';
import { ActionTypes } from '~redux/actionTypes';

const POLLING_DELAY_IN_MS = 3000;

/**
 * Util function polling Amplify to check whether an action with a given transaction hash
 * has already been processed
 */
export function* waitForIngestorToHandleAction(transactionHash: string) {
  yield race({
    task: call(pollAction, transactionHash),
    cancel: take(ActionTypes.CANCEL_ACTION_POLLING),
  });
}

function* pollAction(transactionHash: string) {
  while (true) {
    try {
      const apolloClient = getContext(ContextModule.ApolloClient);
      const result = (yield apolloClient.query({
        query: GetColonyActionDocument,
        variables: {
          transactionHash,
        },
        fetchPolicy: 'network-only',
      })) as ApolloQueryResult<GetColonyActionQuery>;

      if (result.data.getColonyAction) {
        yield put({ type: ActionTypes.CANCEL_ACTION_POLLING });
      } else {
        yield delay(POLLING_DELAY_IN_MS);
      }
    } catch {
      yield put({ type: ActionTypes.CANCEL_ACTION_POLLING });
    }
  }
}
