import { all, call, put } from 'redux-saga/effects';
import {
  getExtensionHash,
  Extension,
  ClientType,
  Id,
  getPermissionProofs,
  ColonyRole,
  colonyRoles2Hex,
} from '@colony/colony-js';
import { poll } from 'ethers/lib/utils';
import { utils } from 'ethers';
import { Network as EthersNetwork } from '@ethersproject/networks';

import {
  CreateColonyMetadataDocument,
  CreateColonyMetadataMutation,
  CreateColonyMetadataMutationVariables,
  CreateColonyTokensDocument,
  CreateColonyTokensMutation,
  CreateColonyTokensMutationVariables,
  CreateDomainDocument,
  CreateDomainMetadataDocument,
  CreateDomainMetadataMutation,
  CreateDomainMetadataMutationVariables,
  CreateDomainMutation,
  CreateDomainMutationVariables,
  CreateUniqueColonyDocument,
  CreateUniqueColonyMutation,
  CreateUniqueColonyMutationVariables,
  CreateUserTokensDocument,
  CreateUserTokensMutation,
  CreateUserTokensMutationVariables,
  CreateWatchedColoniesDocument,
  CreateWatchedColoniesMutation,
  CreateWatchedColoniesMutationVariables,
  DomainColor,
  GetTokenFromEverywhereDocument,
  GetTokenFromEverywhereQuery,
  GetTokenFromEverywhereQueryVariables,
} from '~gql';
import { ColonyManager, ContextModule, getContext } from '~context';
import {
  ADDRESS_ZERO,
  DEFAULT_TOKEN_DECIMALS,
  supportedExtensionsConfig,
} from '~constants';
import { ActionTypes, Action, AllActions } from '~redux/index';
import { createAddress } from '~utils/web3';
import { toNumber } from '~utils/numbers';
import { getDomainDatabaseId } from '~utils/databaseId';

import {
  transactionAddParams,
  transactionAddIdentifier,
  transactionPending,
} from '../../actionCreators';
import {
  putError,
  takeFrom,
  takeLatestCancellable,
  getColonyManager,
  initiateTransaction,
} from '../utils';
import {
  ChannelDefinition,
  createGroupTransaction,
  createTransactionChannels,
} from '../transactions';
import { getOneTxPaymentVersion } from '../utils/extensionVersion';
import { updateTransaction } from '../transactions/transactionsToDb';

function* colonyCreate({
  meta,
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
  const { networkClient } = colonyManager;
  const channelNames: string[] = [];

  /*
   * If the user opted to create a token, define a tx to create the token.
   */
  channelNames.push('createColony');
  /*
   * If the user opted to create a token, define txs to manage the token.
   */
  if (tokenChoice === 'create') {
    channelNames.push('setTokenAuthority');
    channelNames.push('setOwner');
  }

  channelNames.push('deployOneTx');
  channelNames.push('setOneTxRoles');

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
    setTokenAuthority,
    setOwner,
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

    if (setTokenAuthority) {
      yield createGroupTransaction(setTokenAuthority, batchKey, meta, {
        context: ClientType.TokenClient,
        methodName: 'setAuthority',
        ready: false,
      });
    }

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

    if (setOneTxRoles) {
      yield createGroupTransaction(setOneTxRoles, batchKey, meta, {
        context: ClientType.ColonyClient,
        methodContext: 'setOneTxRoles',
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

    const currentColonyVersion = yield networkClient.getCurrentColonyVersion();

    yield put(
      transactionAddParams(createColony.id, [
        usedTokenAddress,
        tokenName,
        tokenSymbol,
        DEFAULT_TOKEN_DECIMALS,
        currentColonyVersion,
        givenColonyName,
        '', // we aren't using ipfs to store metadata in the CDapp
      ]),
    );
    yield initiateTransaction({ id: createColony.id });

    const {
      payload: { eventData },
    } = yield takeFrom(createColony.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    const colonyAddress = eventData.ColonyAdded?.colonyAddress;
    const tokenAddress =
      eventData.TokenDeployed?.tokenAddress || usedTokenAddress;
    const tokenAuthorityAddress =
      eventData.TokenAuthorityDeployed?.tokenAuthorityAddress;

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
    const network: EthersNetwork = yield colonyManager.provider.getNetwork();
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    const isTokenLocked = yield colonyClient.tokenClient.locked();

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
        input: {
          tokenAddress,
          avatar: tokenAvatar || null,
          thumbnail: tokenThumbnail || null,
        },
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
          version: toNumber(currentColonyVersion),
          chainMetadata: {
            chainId: network.chainId,
          },
          status: {
            nativeToken: {
              unlockable: tokenChoice === 'create',
              unlocked: !isTokenLocked,
              mintable: tokenChoice === 'create',
            },
          },
          userId: walletAddress,
          inviteCode,
        },
      },
    });

    /**
     * Save colony metadata to the db
     */
    yield apolloClient.mutate<
      CreateColonyMetadataMutation,
      CreateColonyMetadataMutationVariables
    >({
      mutation: CreateColonyMetadataDocument,
      variables: {
        input: {
          id: colonyAddress,
          displayName,
          isWhitelistActivated: false,
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
     * Save root domain metadata to the database
     */
    yield apolloClient.mutate<
      CreateDomainMetadataMutation,
      CreateDomainMetadataMutationVariables
    >({
      mutation: CreateDomainMetadataDocument,
      variables: {
        input: {
          id: getDomainDatabaseId(colonyAddress, Id.RootDomain),
          color: DomainColor.LightPink,
          name: 'Root',
          description: '',
        },
      },
    });
    /**
     * Create root domain in the database
     * @NOTE: This is a temporary solution and this mutation should be called by block-ingestor on ColonyAdded event
     */
    const [skillId, fundingPotId] = yield colonyClient.getDomain(Id.RootDomain);
    yield apolloClient.mutate<
      CreateDomainMutation,
      CreateDomainMutationVariables
    >({
      mutation: CreateDomainDocument,
      variables: {
        input: {
          id: getDomainDatabaseId(colonyAddress, Id.RootDomain),
          colonyId: colonyAddress,
          isRoot: true,
          nativeId: Id.RootDomain,
          nativeSkillId: toNumber(skillId),
          nativeFundingPotId: toNumber(fundingPotId),
        },
      },
    });

    /*
     * Add a colonyAddress identifier to all pending transactions.
     */
    yield all(
      [deployOneTx, setOneTxRoles]
        .filter(Boolean)
        .map(({ id }) => put(transactionAddIdentifier(id, colonyAddress))),
    );
    yield all(
      [setTokenAuthority, setOwner]
        .filter(Boolean)
        .map(({ id }) => put(transactionAddIdentifier(id, tokenAddress))),
    );

    if (tokenAuthorityAddress) {
      /*
       * Set Token authority (to deployed TokenAuthority)
       */
      yield put(
        transactionAddParams(setTokenAuthority.id, [tokenAuthorityAddress]),
      );
      yield initiateTransaction({ id: setTokenAuthority.id });

      yield takeFrom(
        setTokenAuthority.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    if (setOwner) {
      yield put(transactionAddParams(setOwner.id, [colonyAddress]));
      yield initiateTransaction({ id: setOwner.id });
      yield takeFrom(setOwner.channel, ActionTypes.TRANSACTION_SUCCEEDED);
    }

    if (deployOneTx) {
      /*
       * Deploy OneTx
       */
      const oneTxHash = getExtensionHash(Extension.OneTxPayment);
      const oneTxVersion = yield call(getOneTxPaymentVersion);
      yield put(
        transactionAddParams(deployOneTx.id, [oneTxHash, oneTxVersion]),
      );
      yield initiateTransaction({ id: deployOneTx.id });

      yield takeFrom(deployOneTx.channel, ActionTypes.TRANSACTION_SUCCEEDED);

      /*
       * Set OneTx administration role
       */
      yield put(transactionPending(setOneTxRoles.id));

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

      yield takeFrom(setOneTxRoles.channel, ActionTypes.TRANSACTION_SUCCEEDED);
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
