import { Channel } from 'redux-saga';
import { all, call, fork, put } from 'redux-saga/effects';
import { getExtensionHash, Extension, ClientType, Id } from '@colony/colony-js';
import { poll } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

import {
  CreateColonyTokensDocument,
  CreateColonyTokensMutation,
  CreateColonyTokensMutationVariables,
  CreateUniqueColonyDocument,
  CreateUniqueColonyMutation,
  CreateUniqueColonyMutationVariables,
  CreateUniqueDomainDocument,
  CreateUniqueDomainMutation,
  CreateUniqueDomainMutationVariables,
  CreateUserTokensDocument,
  CreateUserTokensMutation,
  CreateUserTokensMutationVariables,
  CreateWatchedColoniesDocument,
  CreateWatchedColoniesMutation,
  CreateWatchedColoniesMutationVariables,
  GetTokenFromEverywhereDocument,
  GetTokenFromEverywhereQuery,
  GetTokenFromEverywhereQueryVariables,
} from '~gql';
import { ColonyManager, ContextModule, getContext } from '~context';
import {
  DEFAULT_TOKEN_DECIMALS,
  LATEST_ONE_TX_PAYMENT_VERSION,
} from '~constants';
import { ActionTypes, Action, AllActions } from '~redux/index';
import { createAddress } from '~utils/web3';
import { TxConfig } from '~types';

import {
  transactionAddParams,
  transactionAddIdentifier,
  transactionReady,
  transactionLoadRelated,
  transactionPending,
} from '../../actionCreators';
import {
  putError,
  takeFrom,
  takeLatestCancellable,
  getColonyManager,
} from '../utils';
import { createTransaction, createTransactionChannels } from '../transactions';

interface ChannelDefinition {
  channel: Channel<any>;
  index: number;
  id: string;
}

function* colonyCreate({
  meta,
  payload: {
    colonyName: givenColonyName,
    displayName,
    tokenAddress: givenTokenAddress,
    tokenChoice,
    tokenName,
    tokenSymbol,
  },
}: Action<ActionTypes.CREATE>) {
  const apolloClient = getContext(ContextModule.ApolloClient);
  const wallet = getContext(ContextModule.Wallet);
  const walletAddress = wallet?.address;
  const colonyManager: ColonyManager = yield getColonyManager();
  const { networkClient } = colonyManager;
  const channelNames: string[] = [];

  /*
   * If the user opted to create a token, define a tx to create the token.
   */
  if (tokenChoice === 'create') {
    channelNames.push('createToken');
  }
  channelNames.push('createColony');
  /*
   * If the user opted to create a token, define txs to manage the token.
   */
  if (tokenChoice === 'create') {
    channelNames.push('deployTokenAuthority');
    channelNames.push('setTokenAuthority');
    channelNames.push('setOwner');
  }

  channelNames.push('deployOneTx');
  channelNames.push('setOneTxRoleAdministration');
  channelNames.push('setOneTxRoleFunding');

  /*
   * Define a manifest of transaction ids and their respective channels.
   */

  const channels: { [id: string]: ChannelDefinition } = yield call(
    createTransactionChannels,
    meta.id,
    channelNames,
  );
  const {
    createColony,
    createToken,
    deployOneTx,
    setOneTxRoleAdministration,
    setOneTxRoleFunding,
    deployTokenAuthority,
    setTokenAuthority,
    setOwner,
  } = channels;

  const createGroupedTransaction = (
    { id, index }: ChannelDefinition,
    config: TxConfig,
  ) =>
    fork(createTransaction, id, {
      ...config,
      group: {
        key: 'createColony',
        id: meta.id,
        index,
      },
    });

  /*
   * Create all transactions for the group.
   */
  try {
    if (createToken) {
      yield createGroupedTransaction(createToken, {
        context: ClientType.NetworkClient,
        methodName: 'deployToken',
        params: [tokenName, tokenSymbol, DEFAULT_TOKEN_DECIMALS],
      });
    }

    if (createColony) {
      yield createGroupedTransaction(createColony, {
        context: ClientType.NetworkClient,
        methodName: 'createColony(address,uint256,string,string)',
        ready: false,
      });
    }

    if (deployTokenAuthority) {
      yield createGroupedTransaction(deployTokenAuthority, {
        context: ClientType.NetworkClient,
        methodName: 'deployTokenAuthority',
        ready: false,
      });
    }

    if (setTokenAuthority) {
      yield createGroupedTransaction(setTokenAuthority, {
        context: ClientType.TokenClient,
        methodName: 'setAuthority',
        ready: false,
      });
    }

    if (setOwner) {
      yield createGroupedTransaction(setOwner, {
        context: ClientType.TokenClient,
        methodName: 'setOwner',
        ready: false,
      });
    }

    if (deployOneTx) {
      yield createGroupedTransaction(deployOneTx, {
        context: ClientType.ColonyClient,
        methodName: 'installExtension',
        ready: false,
      });
    }

    if (setOneTxRoleAdministration) {
      yield createGroupedTransaction(setOneTxRoleAdministration, {
        context: ClientType.ColonyClient,
        methodContext: 'setOneTxRoles',
        methodName: 'setAdministrationRoleWithProofs',
        ready: false,
      });
    }

    if (setOneTxRoleFunding) {
      yield createGroupedTransaction(setOneTxRoleFunding, {
        context: ClientType.ColonyClient,
        methodContext: 'setOneTxRoles',
        methodName: 'setFundingRoleWithProofs',
        ready: false,
      });
    }

    /*
     * Wait until all transactions are created.
     */
    yield all(
      Object.keys(channels).map((id) =>
        takeFrom(channels[id].channel, ActionTypes.TRANSACTION_CREATED),
      ),
    );

    /*
     * Dispatch a success action; this progresses to next wizard step,
     * where transactions can get processed.
     */
    yield put<AllActions>({
      type: ActionTypes.CREATE_SUCCESS,
      meta,
      payload: undefined,
    });

    /*
     * For transactions that rely on the receipt/event data of previous transactions,
     * wait for these transactions to succeed, collect the data, and apply it to
     * the pending transactions.
     */
    let tokenAddress: string;
    if (createToken) {
      const {
        payload: { deployedContractAddress },
      } = yield takeFrom(
        createToken.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
      tokenAddress = createAddress(deployedContractAddress);
    } else {
      if (!givenTokenAddress) {
        throw new Error('Token address not provided');
      }
      tokenAddress = createAddress(givenTokenAddress);
    }
    /*
     * Add token to db.
     * The query is resolved by "fetchTokenFromChain", which handles the mutation.
     */
    yield apolloClient.query<
      GetTokenFromEverywhereQuery,
      GetTokenFromEverywhereQueryVariables
    >({
      query: GetTokenFromEverywhereDocument,
      variables: {
        input: { tokenAddress },
      },
    });

    /*
     * Add token to current user's token list.
     */
    yield apolloClient.mutate<
      CreateUserTokensMutation,
      CreateUserTokensMutationVariables
    >({
      mutation: CreateUserTokensDocument,
      variables: {
        input: {
          userID: walletAddress,
          tokenID: tokenAddress,
        },
      },
    });

    let colonyAddress;
    if (createColony) {
      const currentColonyVersion =
        yield networkClient.getCurrentColonyVersion();

      yield put(
        transactionAddParams(createColony.id, [
          tokenAddress,
          currentColonyVersion,
          givenColonyName,
          '', // we aren't using ipfs to store metadata in the CDapp
        ]),
      );
      yield put(transactionReady(createColony.id));

      const {
        payload: {
          eventData: {
            ColonyAdded: { colonyAddress: createdColonyAddress },
          },
        },
      } = yield takeFrom(
        createColony.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
      colonyAddress = createdColonyAddress;

      /*
       * Create colony in db
       */
      yield apolloClient.mutate<
        CreateUniqueColonyMutation,
        CreateUniqueColonyMutationVariables
      >({
        mutation: CreateUniqueColonyDocument,
        variables: {
          input: {
            id: colonyAddress,
            name: givenColonyName,
            colonyNativeTokenId: tokenAddress,
            profile: { displayName },
            version: BigNumber.from(currentColonyVersion).toNumber(),
          },
        },
      });

      /*
       * Add token to colony's token list
       */
      yield apolloClient.mutate<
        CreateColonyTokensMutation,
        CreateColonyTokensMutationVariables
      >({
        mutation: CreateColonyTokensDocument,
        variables: {
          input: {
            colonyID: colonyAddress,
            tokenID: tokenAddress,
          },
        },
      });

      /*
       * Subscribe user to colony
       */
      yield apolloClient.mutate<
        CreateWatchedColoniesMutation,
        CreateWatchedColoniesMutationVariables
      >({
        mutation: CreateWatchedColoniesDocument,
        variables: {
          input: {
            colonyID: colonyAddress,
            userID: walletAddress,
          },
        },
      });

      /*
       * Create root domain
       */
      yield apolloClient.mutate<
        CreateUniqueDomainMutation,
        CreateUniqueDomainMutationVariables
      >({
        mutation: CreateUniqueDomainDocument,
        variables: {
          input: {
            colonyAddress,
          },
        },
      });

      if (!colonyAddress) {
        return yield putError(
          ActionTypes.CREATE_ERROR,
          new Error('Missing colony address'),
          meta,
        );
      }

      yield put(transactionLoadRelated(createColony.id, true));
    }

    if (createColony) {
      yield put(transactionLoadRelated(createColony.id, false));
    }
    /*
     * Add a colonyAddress identifier to all pending transactions.
     */
    yield all(
      [
        deployTokenAuthority,
        deployOneTx,
        setOneTxRoleAdministration,
        setOneTxRoleFunding,
      ]
        .filter(Boolean)
        .map(({ id }) => put(transactionAddIdentifier(id, colonyAddress))),
    );
    yield all(
      [setTokenAuthority, setOwner]
        .filter(Boolean)
        .map(({ id }) => put(transactionAddIdentifier(id, tokenAddress))),
    );

    if (deployTokenAuthority) {
      /*
       * Deploy TokenAuthority
       */
      const tokenLockingAddress = yield networkClient.getTokenLocking();
      yield put(
        transactionAddParams(deployTokenAuthority.id, [
          tokenAddress,
          colonyAddress,
          [tokenLockingAddress],
        ]),
      );
      yield put(transactionReady(deployTokenAuthority.id));
      const {
        payload: {
          eventData: {
            TokenAuthorityDeployed: {
              tokenAuthorityAddress: deployedContractAddress,
            },
          },
        },
      } = yield takeFrom(
        deployTokenAuthority.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );

      /*
       * Set Token authority (to deployed TokenAuthority)
       */
      yield put(
        transactionAddParams(setTokenAuthority.id, [deployedContractAddress]),
      );
      yield put(transactionReady(setTokenAuthority.id));
      yield takeFrom(
        setTokenAuthority.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    if (setOwner) {
      yield put(transactionAddParams(setOwner.id, [colonyAddress]));
      yield put(transactionReady(setOwner.id));
      yield takeFrom(setOwner.channel, ActionTypes.TRANSACTION_SUCCEEDED);
    }

    if (deployOneTx) {
      /*
       * Deploy OneTx
       */
      yield put(
        transactionAddParams(deployOneTx.id, [
          getExtensionHash(Extension.OneTxPayment),
          /* @TODO: get latest version of OneTxPayment extn programatically */
          LATEST_ONE_TX_PAYMENT_VERSION || 0,
        ]),
      );
      yield put(transactionReady(deployOneTx.id));

      yield takeFrom(deployOneTx.channel, ActionTypes.TRANSACTION_SUCCEEDED);

      /*
       * Set OneTx administration role
       */
      yield put(transactionPending(setOneTxRoleAdministration.id));

      const oneTxPaymentExtension = yield poll(
        async () => {
          try {
            const client = await colonyManager.getClient(
              ClientType.OneTxPaymentClient,
              colonyAddress,
            );
            return client;
          } catch (err) {
            return undefined;
          }
        },
        {
          timeout: 30000,
        },
      );

      const extensionAddress = oneTxPaymentExtension.address;

      yield put(
        transactionAddParams(setOneTxRoleAdministration.id, [
          extensionAddress,
          Id.RootDomain,
          true,
        ]),
      );
      yield put(transactionReady(setOneTxRoleAdministration.id));
      yield takeFrom(
        setOneTxRoleAdministration.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );

      /*
       * Set OneTx funding role
       */
      yield put(
        transactionAddParams(setOneTxRoleFunding.id, [
          extensionAddress,
          Id.RootDomain,
          true,
        ]),
      );
      yield put(transactionReady(setOneTxRoleFunding.id));

      yield colonyManager.setColonyClient(colonyAddress);

      yield takeFrom(
        setOneTxRoleFunding.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    return null;
  } catch (error) {
    yield putError(ActionTypes.CREATE_ERROR, error, meta);
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

export default function* colonyCreateSaga() {
  yield takeLatestCancellable(
    ActionTypes.CREATE,
    ActionTypes.CREATE_CANCEL,
    colonyCreate,
  );
}
