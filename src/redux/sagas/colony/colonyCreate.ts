import {
  getExtensionHash,
  Extension,
  ClientType,
  Id,
  getPermissionProofs,
  ColonyRole,
  colonyRoles2Hex,
  type AnyColonyClient,
} from '@colony/colony-js';
import { /* BigNumber */ utils } from 'ethers';
import { poll } from 'ethers/lib/utils';
import { all, call, put } from 'redux-saga/effects';

import { mutateWithAuthRetry } from '~apollo/utils.ts';
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
import {
  transactionSetIdentifier,
  transactionSetParams,
  transactionSetPending,
  updateTransaction,
} from '~state/transactionState.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { createAddress } from '~utils/web3/index.ts';

import {
  type ChannelDefinition,
  createGroupTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
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
    createColony,
    installExtensions,
    setExtensionsRoles,
    setOwner,
    // enableStakedExpenditure,
  } = channels;

  const batchKey = TRANSACTION_METHODS.CreateColony;

  if (!givenTokenAddress && (!tokenName || !tokenSymbol)) {
    throw new Error(
      'Token address not given or no token name or symbol provided',
    );
  }

  /*
   * Create all transactions for the group.
   */
  try {
    yield createGroupTransaction({
      channel: createColony,
      batchKey,
      meta,
      config: {
        context: ClientType.NetworkClient,
        methodName: 'createColonyForFrontend',
        ready: false,
      },
    });

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

    yield transactionSetParams(createColony.id, [
      usedTokenAddress,
      tokenName,
      tokenSymbol,
      DEFAULT_TOKEN_DECIMALS,
      currentColonyVersion,
      '', // store colonies on chain without a name
      '', // we aren't using ipfs to store metadata in the CDapp
    ]);
    yield initiateTransaction(createColony.id);

    const {
      payload: { hash: colonyCreationTransactionHash },
    } = yield takeFrom(
      createColony.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    /**
     * Save colony metadata to the db
     */
    yield mutateWithAuthRetry(() =>
      apolloClient.mutate<
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
      }),
    );

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
        updateTransaction({ id, colonyAddress }),
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
        retryLimit: 0,
      },
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

// const DEFAULT_STAKE_FRACTION = BigNumber.from(1)
//   .mul(BigNumber.from(10).pow(DEFAULT_TOKEN_DECIMALS))
//   .div(100); // 1% in wei

function* deployExtensions(
  colonyClient: AnyColonyClient,
  channels: Record<string, ChannelDefinition>,
) {
  const {
    installExtensions,
    setExtensionsRoles /* enableStakedExpenditure */,
  } = channels;

  /*
   * Install OneTxPayment and StakedExpenditure extensions using multicall
   */
  yield transactionSetPending(installExtensions.id);

  const oneTxHash = getExtensionHash(Extension.OneTxPayment);
  const oneTxVersion = yield call(getExtensionVersion, Extension.OneTxPayment);
  // const stakedExpenditureHash = getExtensionHash(Extension.StakedExpenditure);
  // const stakedExpenditureVersion = yield call(
  //   getExtensionVersion,
  //   Extension.StakedExpenditure,
  // );

  const installMulticallData: string[] = [];
  installMulticallData.push(
    colonyClient.interface.encodeFunctionData('installExtension', [
      oneTxHash,
      oneTxVersion,
    ]),
  );
  // installMulticallData.push(
  //   colonyClient.interface.encodeFunctionData('installExtension', [
  //     stakedExpenditureHash,
  //     stakedExpenditureVersion,
  //   ]),
  // );

  yield transactionSetParams(installExtensions.id, [installMulticallData]);
  yield initiateTransaction(installExtensions.id);
  yield waitForTxResult(installExtensions.channel);

  /*
   * Avoid a race condition where the contract might actually not be found on chain
   * even though we have it from inside the transaction receipt
   *
   * This might happen if using different RPC endpoints which are at different block
   * heights from one another
   */
  const [oneTxClient /* stakedExpenditureClient */] = yield all([
    poll(
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
        retryLimit: 0,
      },
    ),
    // poll(
    //   async () => {
    //     try {
    //       const client = await colonyClient.getExtensionClient(
    //         Extension.StakedExpenditure,
    //       );
    //       return client;
    //     } catch (err) {
    //       return undefined;
    //     }
    //   },
    //   {
    //     timeout: 30000,
    //     retryLimit: 0,
    //   },
    // ),
  ]);

  /*
   * Set permissions for the newly deployed extensions
   */
  yield transactionSetPending(setExtensionsRoles.id);

  const setRolesMulticallData: string[] = [];

  const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
    colonyClient.networkClient,
    colonyClient,
    Id.RootDomain,
    [ColonyRole.Architecture, ColonyRole.Root],
  );

  const oneTxConfig = supportedExtensionsConfig.find(
    (config) => config.extensionId === Extension.OneTxPayment,
  );
  // const stakedExpenditureConfig = supportedExtensionsConfig.find(
  //   (config) => config.extensionId === Extension.StakedExpenditure,
  // );

  setRolesMulticallData.push(
    colonyClient.interface.encodeFunctionData('setUserRoles', [
      permissionDomainId,
      childSkillIndex,
      oneTxClient.address,
      Id.RootDomain,
      colonyRoles2Hex(oneTxConfig?.neededColonyPermissions ?? []),
    ]),
  );
  // setRolesMulticallData.push(
  //   colonyClient.interface.encodeFunctionData('setUserRoles', [
  //     permissionDomainId,
  //     childSkillIndex,
  //     stakedExpenditureClient.address,
  //     Id.RootDomain,
  //     colonyRoles2Hex(stakedExpenditureConfig?.neededColonyPermissions ?? []),
  //   ]),
  // );

  yield transactionSetParams(setExtensionsRoles.id, [setRolesMulticallData]);

  yield initiateTransaction(setExtensionsRoles.id);
  yield waitForTxResult(setExtensionsRoles.channel);

  /**
   * Enable Staked Expenditure
   */
  // yield transactionSetPending(enableStakedExpenditure.id);

  // yield put(
  //   transactionAddParams(enableStakedExpenditure.id, [DEFAULT_STAKE_FRACTION]),
  // );

  // yield initiateTransaction({ id: enableStakedExpenditure.id });
  // yield waitForTxResult(enableStakedExpenditure.channel);
}

export default function* colonyCreateSaga() {
  yield takeLatestCancellable(
    ActionTypes.CREATE,
    ActionTypes.CREATE_CANCEL,
    colonyCreate,
  );
}
