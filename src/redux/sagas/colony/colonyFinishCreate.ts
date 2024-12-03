import { ClientType } from '@colony/colony-js';
import { all, call, put, takeEvery } from 'redux-saga/effects';

import {
  type ColonyManager,
  ContextModule,
  getContext,
} from '~context/index.ts';
import {
  type GetFullColonyByNameQuery,
  type GetFullColonyByNameQueryVariables,
  GetFullColonyByNameDocument,
} from '~gql';
import { ActionTypes, type Action, type AllActions } from '~redux/index.ts';
import {
  transactionSetIdentifier,
  transactionSetParams,
} from '~state/transactionState.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  type ChannelDefinition,
  createGroupTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  putError,
  getColonyManager,
  initiateTransaction,
} from '../utils/index.ts';

import { deployExtensions } from './colonyCreate.ts';

function* colonyFinishCreate({
  meta,
  meta: { navigate },
  payload: { colonyName, tokenChoice },
}: Action<ActionTypes.FINISH_CREATE>) {
  const apolloClient = getContext(ContextModule.ApolloClient);
  const colonyManager: ColonyManager = yield getColonyManager();

  const colonyData: GetFullColonyByNameQuery | undefined = yield new Promise(
    (resolve, reject) => {
      const subscription = apolloClient
        .watchQuery<
          GetFullColonyByNameQuery,
          GetFullColonyByNameQueryVariables
        >({
          query: GetFullColonyByNameDocument,
          variables: {
            name: colonyName,
          },
          pollInterval: 1000,
          errorPolicy: 'ignore',
        })
        .subscribe({
          next: ({ data }) => {
            const [colony] = data.getColonyByName?.items ?? [];
            const { roles, metadata } = colony ?? {};
            const { displayName: existingColonyDisplayName } = metadata || {};

            // Check if the required data is available
            if (existingColonyDisplayName && roles?.items.length) {
              subscription.unsubscribe(); // Stop polling to prevent memory leakage
              resolve(data);
            }
          },
          error: (error) => {
            subscription.unsubscribe(); // Clean up on error
            reject(error); // Reject the promise with the error
          },
        });
    },
  );

  const colony = colonyData?.getColonyByName?.items[0];

  if (!colony) {
    throw new Error('Cannot find colony');
  }

  const {
    colonyAddress,
    nativeToken: { tokenAddress },
  } = colony;

  // Then remove this
  if (!colonyAddress) {
    throw new Error('Unable to find colony');
  }

  const channelNames: string[] = [];

  /*
   * If the user opted to create a token, define txs to manage the token.
   */
  if (tokenChoice === 'create') {
    channelNames.push('setOwner');
  }

  channelNames.push('installExtensions');
  channelNames.push('setExtensionsRoles');
  // channelNames.push('enableStakedExpenditure');

  /*
   * Define a manifest of transaction ids and their respective channels.
   */

  const channels: { [id: string]: ChannelDefinition } = yield call(
    createTransactionChannels,
    meta.id,
    channelNames,
  );

  const {
    installExtensions,
    setExtensionsRoles,
    setOwner,
    // enableStakedExpenditure,
  } = channels;

  const batchKey = TRANSACTION_METHODS.FinishCreateColony;

  /*
   * Create all transactions for the group.
   */
  try {
    if (setOwner) {
      yield createGroupTransaction({
        channel: setOwner,
        batchKey,
        meta,
        config: {
          context: ClientType.TokenClient,
          methodName: 'setOwner',
          ready: false,
        },
      });
    }

    if (installExtensions) {
      yield createGroupTransaction({
        channel: installExtensions,
        batchKey,
        meta,
        config: {
          context: ClientType.ColonyClient,
          methodName: 'multicall',
          methodContext: 'installExtensions',
          ready: false,
        },
      });
    }

    if (setExtensionsRoles) {
      yield createGroupTransaction({
        channel: setExtensionsRoles,
        batchKey,
        meta,
        config: {
          context: ClientType.ColonyClient,
          methodContext: 'setExtensionsRoles',
          methodName: 'multicall',
          ready: false,
        },
      });
    }

    // if (enableStakedExpenditure) {
    //   yield createGroupTransaction(enableStakedExpenditure, batchKey, meta, {
    //     context: ClientType.StakedExpenditureClient,
    //     methodName: 'initialise',
    //     ready: false,
    //   });
    // }

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    /*
     * Add a colonyAddress identifier to all pending transactions.
     */
    yield all(
      [installExtensions, setExtensionsRoles /* , enableStakedExpenditure */]
        .filter(Boolean)
        .map(({ id }) => transactionSetIdentifier(id, colonyAddress)),
    );
    yield all(
      [setOwner]
        .filter(Boolean)
        .map(({ id }) => transactionSetIdentifier(id, tokenAddress)),
    );

    if (setOwner) {
      yield transactionSetParams(setOwner.id, [colonyAddress]);
      yield initiateTransaction(setOwner.id);
      yield waitForTxResult(setOwner.channel);
    }

    if (installExtensions) {
      yield deployExtensions(colonyClient, {
        installExtensions,
        setExtensionsRoles,
        // enableStakedExpenditure,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.FINISH_CREATE_SUCCESS,
      meta,
      payload: undefined,
    });

    if (navigate) {
      navigate(`/${colonyName}`, {
        state: {
          isRedirect: true,
          hasRecentlyCreatedColony: true,
        },
      });
    }

    return null;
  } catch (error) {
    yield putError(ActionTypes.FINISH_CREATE_ERROR, error, meta);
    /*
     * For non-transaction errors (where something is probably irreversibly wrong),
     * cancel the saga.
     */
    return null;
  } finally {
    /*
     * Close all transaction channels.
     */
    yield all(
      Object.keys(channels).map((id) =>
        call([channels[id].channel, channels[id].channel.close]),
      ),
    );
  }
}

export default function* colonyFinishCreateSaga() {
  yield takeEvery(ActionTypes.FINISH_CREATE, colonyFinishCreate);
}
