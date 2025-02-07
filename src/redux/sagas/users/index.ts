// import { BigNumber } from 'ethers';
import { type QueryOptions } from '@apollo/client';
import { ClientType, Tokens, type TokenLockingClient } from '@colony/colony-js';
import { BigNumber, utils } from 'ethers';
import { call, fork, put, takeLatest } from 'redux-saga/effects';

import { mutateWithAuthRetry } from '~apollo/utils.ts';
import { deauthenticateWallet } from '~auth/index.ts';
import { DEV_USDC_ADDRESS, isDev } from '~constants';
import {
  type ColonyManager,
  ContextModule,
  getContext,
  removeContext,
} from '~context/index.ts';
import {
  CreateUniqueUserDocument,
  type CreateUniqueUserMutation,
  type CreateUniqueUserMutationVariables,
  GetProfileByEmailDocument,
  GetUserByNameDocument,
} from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type Action, type AllActions } from '~redux/types/actions/index.ts';
import { LANDING_PAGE_ROUTE } from '~routes/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { clearLastWallet } from '~utils/autoLogin.ts';

import {
  createGroupTransaction,
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
} from '../utils/index.ts';

// import { transactionLoadRelated, transactionReady } from '../../actionCreators';

// function* userAvatarRemove({ meta }: Action<ActionTypes.USER_AVATAR_REMOVE>) {
//   try {
//     const { walletAddress } = yield getLoggedInUser();
//     const apolloClient = getContext(ContextModule.ApolloClient);

// yield mutateWithAuthRetry(() =>
//   apolloClient.mutate<EditUserMutation, EditUserMutationVariables>({
//     mutation: EditUserDocument,
//     variables: { input: { avatarHash: null } },
//   }),
// );

//     yield put<AllActions>({
//       type: ActionTypes.USER_AVATAR_REMOVE_SUCCESS,
//       payload: { address: walletAddress },
//       meta,
//     });
//   } catch (error) {
//     return yield putError(ActionTypes.USER_AVATAR_REMOVE_ERROR, error, meta);
//   }
//   return null;
// }

// function* userAvatarUpload({
//   meta,
//   payload,
// }: Action<ActionTypes.USER_AVATAR_UPLOAD>) {
//   try {
//     const { walletAddress } = yield getLoggedInUser();
//     const apolloClient = getContext(ContextModule.ApolloClient);

//     let ipfsHash = null;
//     if (payload.data) {
//       try {
//         ipfsHash = yield call(
//           ipfsUpload,
//           JSON.stringify({ image: payload.data } as IPFSAvatarImage),
//         );
//       } catch (error) {
//         // silent error
//       }
//     }

// yield mutateWithAuthRetry(() =>
//   apolloClient.mutate<EditUserMutation, EditUserMutationVariables>({
//     mutation: EditUserDocument,
//     variables: { input: { avatarHash: ipfsHash } },
//   }),
// );

//     yield put<AllActions>({
//       type: ActionTypes.USER_AVATAR_UPLOAD_SUCCESS,
//       meta,
//       payload: {
//         hash: ipfsHash,
//         avatar: payload.data,
//         address: walletAddress,
//       },
//     });
//   } catch (error) {
//     return yield putError(ActionTypes.USER_AVATAR_UPLOAD_ERROR, error, meta);
//   }
//   return null;
// }

type UserLogoutParams = {
  payload?: { shouldRemoveWalletContext: boolean };
};

function* usernameCreate({
  meta,
  meta: { navigate, updateUser, colonyName },
  payload: { username, emailAddress },
}: Action<ActionTypes.USERNAME_CREATE>) {
  const wallet = getContext(ContextModule.Wallet);
  const walletAddress = utils.getAddress(wallet.address);

  const apolloClient = getContext(ContextModule.ApolloClient);

  try {
    /* Queries will be refetched after the mutation, in order to update the cache. */
    const refetchQueries: QueryOptions[] = [
      {
        query: GetUserByNameDocument,
        variables: { name: username },
      },
    ];

    if (emailAddress) {
      refetchQueries.push({
        query: GetProfileByEmailDocument,
        variables: { email: emailAddress },
      });
    }
    /*
     * Write user to db
     */
    yield mutateWithAuthRetry(() =>
      apolloClient.mutate<
        CreateUniqueUserMutation,
        CreateUniqueUserMutationVariables
      >({
        mutation: CreateUniqueUserDocument,
        variables: {
          input: {
            id: walletAddress,
            profile: {
              displayName: username,
              email: emailAddress || undefined,
            },
          },
        },
        refetchQueries,
      }),
    );

    if (updateUser) {
      yield call(updateUser, walletAddress, true);
    }

    yield put<AllActions>({
      type: ActionTypes.USERNAME_CREATE_SUCCESS,
      payload: {
        emailAddress,
        username,
      },
      meta,
    });
    if (navigate) {
      navigate(colonyName ? `/${colonyName}` : LANDING_PAGE_ROUTE);
    }
  } catch (error) {
    return yield putError(ActionTypes.USERNAME_CREATE_ERROR, error, meta);
  }
  return null;
}

export const disconnectWallet = (
  walletLabel: string,
  shouldRemoveWalletContext = true,
) => {
  const onboard = getContext(ContextModule.Onboard);
  onboard.disconnectWallet({ label: walletLabel });

  if (shouldRemoveWalletContext) {
    removeContext(ContextModule.Wallet);
  }
  clearLastWallet();
};

export function* userLogout(data?: UserLogoutParams) {
  const shouldRemoveWalletContext =
    data?.payload?.shouldRemoveWalletContext ?? true;
  try {
    removeContext(ContextModule.ColonyManager);
    const apolloClient = getContext(ContextModule.ApolloClient);
    if (shouldRemoveWalletContext) {
      removeContext(ContextModule.Wallet);
    }
    clearLastWallet(); // only for legacy purposes
    yield deauthenticateWallet();
    apolloClient.resetStore();
    yield put<AllActions>({
      type: ActionTypes.USER_LOGOUT_SUCCESS,
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_LOGOUT_ERROR, error);
  }
  return null;
}

function* userDepositToken({
  meta,
  payload: { tokenAddress, amount, colonyAddress },
}: Action<ActionTypes.USER_DEPOSIT_TOKEN>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const colonyManager = yield getColonyManager();

    const tokenLockingClient: TokenLockingClient =
      yield colonyManager.getClient(
        ClientType.TokenLockingClient,
        colonyAddress,
      );

    const batchKey = TRANSACTION_METHODS.Deposit;

    const { approve, deposit } = yield createTransactionChannels(meta.id, [
      'approve',
      'deposit',
    ]);

    yield createGroupTransaction({
      channel: approve,
      batchKey,
      meta,
      config: {
        context: ClientType.TokenClient,
        methodName: 'approve',
        identifier: tokenAddress,
        params: [tokenLockingClient.address, BigNumber.from(amount)],
        ready: false,
      },
    });

    yield createGroupTransaction({
      channel: deposit,
      batchKey,
      meta,
      config: {
        context: ClientType.TokenLockingClient,
        methodName: 'deposit(address,uint256,bool)',
        identifier: colonyAddress,
        params: [tokenAddress, BigNumber.from(amount), false],
        ready: false,
      },
    });

    yield takeFrom(approve.channel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction(approve.id);

    yield waitForTxResult(approve.channel);

    yield takeFrom(deposit.channel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction(deposit.id);

    yield waitForTxResult(deposit.channel);

    yield put({
      type: ActionTypes.USER_DEPOSIT_TOKEN_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_DEPOSIT_TOKEN_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

function* userWithdrawToken({
  meta,
  payload: { tokenAddress, amount, colonyAddress },
}: Action<ActionTypes.USER_WITHDRAW_TOKEN>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const { withdraw } = yield createTransactionChannels(meta.id, ['withdraw']);

    yield fork(createTransaction, withdraw.id, {
      context: ClientType.TokenLockingClient,
      methodName: 'withdraw(address,uint256,bool)',
      identifier: colonyAddress,
      params: [tokenAddress, BigNumber.from(amount), false],
      ready: false,
      group: {
        key: 'withdraw',
        id: meta.id,
        index: 0,
      },
    });

    yield takeFrom(withdraw.channel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction(withdraw.id);

    yield waitForTxResult(withdraw.channel);

    yield put<AllActions>({
      type: ActionTypes.USER_WITHDRAW_TOKEN_SUCCESS,
      meta,
      payload: {
        tokenAddress,
        amount,
      },
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_WITHDRAW_TOKEN_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

function* userCryptoToFiatTransfer({
  meta,
  payload: { amount },
}: Action<ActionTypes.USER_CRYPTO_TO_FIAT_TRANSFER>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const wallet = getContext(ContextModule.Wallet);

    if (!wallet) {
      throw new Error('Wallet not found in context');
    }

    const colonyManager: ColonyManager = yield getColonyManager();
    const { network } = colonyManager.networkClient;

    const tokenAddress = isDev ? DEV_USDC_ADDRESS : Tokens[network]?.USDC;
    const tokenClient = yield colonyManager.getTokenClient(tokenAddress);
    const decimals = yield tokenClient.decimals();

    if (!tokenAddress) {
      throw new Error(`USDC token address not found on network ${network}`);
    }

    // @TODO: Needs to be replaced with bridgeGetUserLiquidationAddress query
    // const { data } = yield apolloClient.query<
    //   GetUserLiquidationAddressesQuery,
    //   GetUserLiquidationAddressesQueryVariables
    // >({
    //   query: GetUserLiquidationAddressesDocument,
    //   variables: {
    //     userAddress: utils.getAddress(wallet.address),
    //     chainId,
    //   },
    // });
    const data = {} as any;

    const liquidationAddress =
      data.getLiquidationAddressesByUserAddress?.items[0]?.liquidationAddress;

    if (!liquidationAddress) {
      throw new Error(
        `Liquidation address not found for user ${wallet.address}`,
      );
    }

    const batchKey = TRANSACTION_METHODS.Crypto2Fiat;

    const { transfer } = yield createTransactionChannels(meta.id, ['transfer']);

    yield createGroupTransaction({
      channel: transfer,
      batchKey,
      meta,
      config: {
        context: ClientType.TokenClient,
        methodName: 'transfer',
        identifier: tokenAddress,
        params: [
          liquidationAddress,
          BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals)),
        ],
        ready: true,
      },
    });

    yield takeFrom(transfer.channel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction(transfer.id);

    yield waitForTxResult(transfer.channel);

    yield put({
      type: ActionTypes.USER_CRYPTO_TO_FIAT_TRANSFER_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.USER_CRYPTO_TO_FIAT_TRANSFER_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export function* setupUsersSagas() {
  // yield takeLatest(ActionTypes.USER_AVATAR_REMOVE, userAvatarRemove);
  // yield takeLatest(ActionTypes.USER_AVATAR_UPLOAD, userAvatarUpload);
  yield takeLatest(ActionTypes.USER_LOGOUT, userLogout);
  yield takeLatest(ActionTypes.USERNAME_CREATE, usernameCreate);
  yield takeLatest(ActionTypes.USER_DEPOSIT_TOKEN, userDepositToken);
  yield takeLatest(ActionTypes.USER_WITHDRAW_TOKEN, userWithdrawToken);
  yield takeLatest(
    ActionTypes.USER_CRYPTO_TO_FIAT_TRANSFER,
    userCryptoToFiatTransfer,
  );
}
