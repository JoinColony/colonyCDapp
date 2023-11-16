import { call, fork, put, takeLatest } from 'redux-saga/effects';
import { BigNumber, utils } from 'ethers';
// import { BigNumber } from 'ethers';
import { QueryOptions } from '@apollo/client';
import { ClientType, TokenLockingClient } from '@colony/colony-js';

import { ContextModule, getContext, removeContext } from '~context';
import { clearLastWallet } from '~utils/autoLogin';
import {
  CreateUniqueUserDocument,
  CreateUniqueUserMutation,
  CreateUniqueUserMutationVariables,
  GetProfileByEmailDocument,
  GetUserByNameDocument,
} from '~gql';
import { LANDING_PAGE_ROUTE } from '~routes';

import { ActionTypes } from '../../actionTypes';
import { Action, AllActions } from '../../types/actions';
import {
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
} from '../utils';
import {
  createGroupTransaction,
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';

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
  meta: { navigate, updateUser },
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
      navigate(LANDING_PAGE_ROUTE);
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

    const batchKey = 'deposit';

    const { approve, deposit } = yield createTransactionChannels(meta.id, [
      'approve',
      'deposit',
    ]);

    yield createGroupTransaction(approve, batchKey, meta, {
      context: ClientType.TokenClient,
      methodName: 'approve',
      identifier: tokenAddress,
      params: [tokenLockingClient.address, BigNumber.from(amount)],
      ready: false,
    });

    yield createGroupTransaction(deposit, batchKey, meta, {
      context: ClientType.TokenLockingClient,
      methodName: 'deposit(address,uint256,bool)',
      identifier: colonyAddress,
      params: [tokenAddress, BigNumber.from(amount), false],
      ready: false,
    });

    yield takeFrom(approve.channel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction({ id: approve.id });

    yield takeFrom(approve.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield takeFrom(deposit.channel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction({ id: deposit.id });

    yield takeFrom(deposit.channel, ActionTypes.TRANSACTION_SUCCEEDED);

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

    yield initiateTransaction({ id: withdraw.id });

    yield takeFrom(withdraw.channel, ActionTypes.TRANSACTION_SUCCEEDED);

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
