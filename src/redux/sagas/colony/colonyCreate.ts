import {
  getExtensionHash,
  Extension,
  ClientType,
  Id,
  getPermissionProofs,
  ColonyRole,
  colonyRoles2Hex,
} from '@colony/colony-js';
import { utils } from 'ethers';
import { poll } from 'ethers/lib/utils';
import { all, call, put } from 'redux-saga/effects';

import {
  ADDRESS_ZERO,
  DEFAULT_TOKEN_DECIMALS,
  supportedExtensionsConfig,
} from '~constants/index.ts';
import {
  type ColonyManager,
  ContextModule,
  getContext,
} from '~context/index.ts';
import {
  CreateColonyEtherealMetadataDocument,
  type CreateColonyEtherealMetadataMutation,
  type CreateColonyEtherealMetadataMutationVariables,
  GetCurrentColonyVersionDocument,
  type GetCurrentColonyVersionQuery,
  type GetCurrentColonyVersionQueryVariables,
  GetFullColonyByNameDocument,
  type GetFullColonyByNameQuery,
  type GetFullColonyByNameQueryVariables,
} from '~gql';
import { ActionTypes, type Action, type AllActions } from '~redux/index.ts';
import { createAddress } from '~utils/web3/index.ts';

import {
  transactionAddParams,
  transactionAddIdentifier,
  transactionPending,
} from '../../actionCreators/index.ts';
import {
  type ChannelDefinition,
  createGroupTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import { updateTransaction } from '../transactions/transactionsToDb.ts';
import { getExtensionVersion } from '../utils/extensionVersion.ts';
import {
  putError,
  takeFrom,
  takeLatestCancellable,
  getColonyManager,
  initiateTransaction,
} from '../utils/index.ts';

function* colonyCreate({
  meta,
  meta: { navigate },
  payload: {
    colonyName: givenColonyName,
    displayName,
    tokenAddress: givenTokenAddress,
    tokenChoice,
    tokenName = '',
    tokenSymbol = '',
    inviteCode,
    tokenAvatar,
    tokenThumbnail,
  },
}: Action<ActionTypes.CREATE>) {
  const apolloClient = getContext(ContextModule.ApolloClient);
  const wallet = getContext(ContextModule.Wallet);
  const walletAddress = utils.getAddress(wallet.address);
  const colonyManager: ColonyManager = yield getColonyManager();
  const channelNames: string[] = [];

  /*
   * If the user opted to create a token, define a tx to create the token.
   */
  channelNames.push('createColony');
  /*
   * If the user opted to create a token, define txs to manage the token.
   */
  if (tokenChoice === 'create') {
    channelNames.push('setOwner');
  }

  channelNames.push('deployOneTx');
  channelNames.push('deployStakedExpenditure');
  channelNames.push('setOneTxRoles');
  channelNames.push('setStakedExpenditureRoles');

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
    deployOneTx,
    setOneTxRoles,
    setOwner,
    deployStakedExpenditure,
    setStakedExpenditureRoles,
  } = channels;

  const batchKey = 'createColony';

  if (!givenTokenAddress && (!tokenName || !tokenSymbol)) {
    throw new Error(
      'Token address not given or no token name or symbol provided',
    );
  }

  /*
   * Create all transactions for the group.
   */
  try {
    yield createGroupTransaction(createColony, batchKey, meta, {
      context: ClientType.NetworkClient,
      methodName: 'createColonyForFrontend',
      ready: false,
    });

    if (setOwner) {
      yield createGroupTransaction(setOwner, batchKey, meta, {
        context: ClientType.TokenClient,
        methodName: 'setOwner',
        ready: false,
      });
    }

    if (deployOneTx) {
      yield createGroupTransaction(deployOneTx, batchKey, meta, {
        context: ClientType.ColonyClient,
        methodName: 'installExtension',
        ready: false,
      });
    }

    if (deployStakedExpenditure) {
      yield createGroupTransaction(deployStakedExpenditure, batchKey, meta, {
        context: ClientType.ColonyClient,
        methodName: 'installExtension',
        ready: false,
      });
    }

    if (setOneTxRoles) {
      yield createGroupTransaction(setOneTxRoles, batchKey, meta, {
        context: ClientType.ColonyClient,
        methodContext: 'setOneTxRoles',
        methodName: 'setUserRoles',
        ready: false,
      });
    }

    if (setStakedExpenditureRoles) {
      yield createGroupTransaction(setStakedExpenditureRoles, batchKey, meta, {
        context: ClientType.ColonyClient,
        methodContext: 'setStakedExpenditureRoles',
        methodName: 'setUserRoles',
        ready: false,
      });
    }

    /*
     * Wait until all transactions are created.
     */
    const transactionCreatedActions = yield all(
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

    const usedTokenAddress = givenTokenAddress
      ? createAddress(givenTokenAddress)
      : ADDRESS_ZERO;

    const { data: colonyVersionData } = yield apolloClient.query<
      GetCurrentColonyVersionQuery,
      GetCurrentColonyVersionQueryVariables
    >({
      query: GetCurrentColonyVersionDocument,
    });

    const [{ version: currentColonyVersion = 0 }] =
      colonyVersionData?.getCurrentVersionByKey?.items ?? [];

    yield put(
      transactionAddParams(createColony.id, [
        usedTokenAddress,
        tokenName,
        tokenSymbol,
        DEFAULT_TOKEN_DECIMALS,
        currentColonyVersion,
        '', // store colonies on chain without a name
        '', // we aren't using ipfs to store metadata in the CDapp
      ]),
    );
    yield initiateTransaction({ id: createColony.id });

    const {
      payload: { hash: colonyCreationTransactionHash },
    } = yield takeFrom(
      createColony.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    /**
     * Save colony metadata to the db
     */
    yield apolloClient.mutate<
      CreateColonyEtherealMetadataMutation,
      CreateColonyEtherealMetadataMutationVariables
    >({
      mutation: CreateColonyEtherealMetadataDocument,
      variables: {
        input: {
          colonyName: givenColonyName,
          colonyDisplayName: displayName,
          tokenAvatar,
          tokenThumbnail,
          initiatorAddress: walletAddress,
          transactionHash: colonyCreationTransactionHash,
          inviteCode, // temporary, while in private beta
        },
      },
    });

    const {
      payload: { eventData },
    } = yield waitForTxResult(createColony.channel);

    const colonyAddress = eventData.ColonyAdded?.colonyAddress;
    const tokenAddress =
      eventData.TokenDeployed?.tokenAddress || usedTokenAddress;

    /*
     * Update transactions saved in the db with the new colony address
     * This is so that the Create Colony action group persists in the user's transaction history
     */
    yield all(
      transactionCreatedActions.map(({ meta: { id } }) =>
        updateTransaction({ id, colonyAddress, from: walletAddress }),
      ),
    );

    if (!colonyAddress) {
      return yield putError(
        ActionTypes.CREATE_ERROR,
        new Error('Colony address not provided'),
        meta,
      );
    }
    if (tokenAddress === ADDRESS_ZERO) {
      return yield putError(
        ActionTypes.CREATE_ERROR,
        new Error('Token address not provided'),
        meta,
      );
    }

    /*
     * Avoid a race condition where the contract might actually not be found on chain
     * even though we have it from inside the transaction receipt
     *
     * This might happen if using different RPC endpoints which are at different block
     * heights from one another
     */
    const colonyClient = yield poll(
      async () => {
        try {
          const client = await colonyManager.getClient(
            ClientType.ColonyClient,
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

    /*
     * Add a colonyAddress identifier to all pending transactions.
     */
    yield all(
      [
        deployOneTx,
        setOneTxRoles,
        deployStakedExpenditure,
        setStakedExpenditureRoles,
      ]
        .filter(Boolean)
        .map(({ id }) => put(transactionAddIdentifier(id, colonyAddress))),
    );
    yield all(
      [setOwner]
        .filter(Boolean)
        .map(({ id }) => put(transactionAddIdentifier(id, tokenAddress))),
    );

    if (setOwner) {
      yield put(transactionAddParams(setOwner.id, [colonyAddress]));
      yield initiateTransaction({ id: setOwner.id });
      yield waitForTxResult(setOwner.channel);
    }

    if (deployOneTx) {
      /*
       * Deploy OneTx
       */
      const oneTxHash = getExtensionHash(Extension.OneTxPayment);
      const oneTxVersion = yield call(
        getExtensionVersion,
        Extension.OneTxPayment,
      );
      yield put(
        transactionAddParams(deployOneTx.id, [oneTxHash, oneTxVersion]),
      );
      yield initiateTransaction({ id: deployOneTx.id });

      yield waitForTxResult(deployOneTx.channel);

      /*
       * Set OneTx administration role
       */
      yield put(transactionPending(setOneTxRoles.id));

      /*
       * Avoid a race condition where the contract might actually not be found on chain
       * even though we have it from inside the transaction receipt
       *
       * This might happen if using different RPC endpoints which are at different block
       * heights from one another
       */
      const oneTxPaymentExtension = yield poll(
        async () => {
          try {
            const client = await colonyClient.getExtensionClient(
              Extension.OneTxPayment,
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

      /*
       * Generate proofs for setting permissions the the newly deployed OneTxPayment extension
       */
      const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        Id.RootDomain,
        [ColonyRole.Architecture, ColonyRole.Root],
      );

      const extensionConfig = supportedExtensionsConfig.find(
        (config) => config.extensionId === Extension.OneTxPayment,
      );
      yield put(
        transactionAddParams(setOneTxRoles.id, [
          permissionDomainId,
          childSkillIndex,
          oneTxPaymentExtension.address,
          Id.RootDomain,
          colonyRoles2Hex(extensionConfig?.neededColonyPermissions ?? []),
        ]),
      );
      yield initiateTransaction({ id: setOneTxRoles.id });

      yield waitForTxResult(setOneTxRoles.channel);
    }

    if (deployStakedExpenditure) {
      /*
       * Deploy Staked Expenditure
       */
      const stakedExpenditureHash = getExtensionHash(
        Extension.StakedExpenditure,
      );
      const stakedExpenditureVersion = yield call(
        getExtensionVersion,
        Extension.StakedExpenditure,
      );
      yield put(
        transactionAddParams(deployStakedExpenditure.id, [
          stakedExpenditureHash,
          stakedExpenditureVersion,
        ]),
      );
      yield initiateTransaction({ id: deployStakedExpenditure.id });

      yield waitForTxResult(deployStakedExpenditure.channel);

      /*
       * Avoid a race condition where the contract might actually not be found on chain
       * even though we have it from inside the transaction receipt
       *
       * This might happen if using different RPC endpoints which are at different block
       * heights from one another
       */
      const stakedExpenditureClient = yield poll(
        async () => {
          try {
            const client = await colonyClient.getExtensionClient(
              Extension.StakedExpenditure,
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

      /*
       * Set OneTx administration role
       */
      yield put(transactionPending(setStakedExpenditureRoles.id));

      /*
       * Generate proofs for setting permissions the the newly deployed OneTxPayment extension
       */
      const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        Id.RootDomain,
        [ColonyRole.Architecture, ColonyRole.Root],
      );

      const extensionConfig = supportedExtensionsConfig.find(
        (config) => config.extensionId === Extension.StakedExpenditure,
      );
      yield put(
        transactionAddParams(setStakedExpenditureRoles.id, [
          permissionDomainId,
          childSkillIndex,
          stakedExpenditureClient.address,
          Id.RootDomain,
          colonyRoles2Hex(extensionConfig?.neededColonyPermissions ?? []),
        ]),
      );
      yield initiateTransaction({ id: setStakedExpenditureRoles.id });

      yield waitForTxResult(setStakedExpenditureRoles.channel);
    }

    /*
     * Wait for the colony to exist, then navigate to it.
     */
    const colonyExistsSubscription = yield apolloClient
      .watchQuery<GetFullColonyByNameQuery, GetFullColonyByNameQueryVariables>({
        query: GetFullColonyByNameDocument,
        variables: {
          name: givenColonyName,
        },
        pollInterval: 1000,
        errorPolicy: 'ignore',
      })
      .subscribe({
        next: ({ data: { getColonyByName } }) => {
          const [colony] = getColonyByName?.items ?? [];
          const { roles, metadata } = colony ?? {};
          const { displayName: existingColonyDisplayName } = metadata || {};
          /*
           * @NOTE Check for role existance.
           *
           * There's a race condition here because roles are the last events to get picked up
           * by the ingestor and set, meaning there's a certain point in time where the colony
           * entry/object will exist and will be returned by the query, whoever the roles relatioship
           * won't exist yet, and since that is required, the colony context will error and redirect
           * to 404
           */
          if (existingColonyDisplayName && roles?.items.length && navigate) {
            /*
             * Unsub to prevent memory leakeage.
             */
            colonyExistsSubscription.unsubscribe();
            /*
             * Navigate to the colony.
             */
            navigate(`/${givenColonyName}`, {
              state: {
                isRedirect: true,
                hasRecentlyCreatedColony: true,
              },
            });
          }
        },
      });

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
