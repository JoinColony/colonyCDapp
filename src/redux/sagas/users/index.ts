// import { BigNumber } from 'ethers';
import { type QueryOptions } from '@apollo/client';
import { ClientType, type TokenLockingClient } from '@colony/colony-js';
import { BigNumber, utils } from 'ethers';
import { call, fork, put, takeLatest } from 'redux-saga/effects';

import { deauthenticateWallet } from '~auth/index.ts';
import { ContextModule, getContext, removeContext } from '~context/index.ts';
import {
  CreateUniqueUserDocument,
  type CreateUniqueUserMutation,
  type CreateUniqueUserMutationVariables,
  GetProfileByEmailDocument,
  GetUserByNameDocument,
} from '~gql';
import { LANDING_PAGE_ROUTE } from '~routes/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { clearLastWallet } from '~utils/autoLogin.ts';

import { ActionTypes } from '../../actionTypes.ts';
import { type Action, type AllActions } from '../../types/actions/index.ts';
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
//     yield apolloClient.mutate<EditUserMutation, EditUserMutationVariables>({
//       mutation: EditUserDocument,
//       variables: { input: { avatarHash: null } },
//     });

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

//     yield apolloClient.mutate<EditUserMutation, EditUserMutationVariables>({
//       mutation: EditUserDocument,
//       variables: { input: { avatarHash: ipfsHash } },
//     });

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
    yield apolloClient.mutate<
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
    });

    yield put<AllActions>({
      type: ActionTypes.USERNAME_CREATE_SUCCESS,
      payload: {
        emailAddress,
        username,
      },
      meta,
    });

    if (updateUser) {
      updateUser(walletAddress, true);
    }

    if (navigate) {
      navigate(colonyName ? `/${colonyName}` : LANDING_PAGE_ROUTE);
    }
  } catch (error) {
    return yield putError(ActionTypes.USERNAME_CREATE_ERROR, error, meta);
  }
  return null;
}

export const disconnectWallet = (walletLabel: string) => {
  const onboard = getContext(ContextModule.Onboard);
  onboard.disconnectWallet({ label: walletLabel });
  removeContext(ContextModule.Wallet);
  clearLastWallet();
};

function* userLogout() {
  try {
    removeContext(ContextModule.ColonyManager);
    const wallet = getContext(ContextModule.Wallet);
    disconnectWallet(wallet.label);
    yield deauthenticateWallet();
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

export function* setupUsersSagas() {
  // yield takeLatest(ActionTypes.USER_AVATAR_REMOVE, userAvatarRemove);
  // yield takeLatest(ActionTypes.USER_AVATAR_UPLOAD, userAvatarUpload);
  yield takeLatest(ActionTypes.USER_LOGOUT, userLogout);
  yield takeLatest(ActionTypes.USERNAME_CREATE, usernameCreate);
  yield takeLatest(ActionTypes.USER_DEPOSIT_TOKEN, userDepositToken);
  yield takeLatest(ActionTypes.USER_WITHDRAW_TOKEN, userWithdrawToken);
}
