import { ClientType, Extension, getPotDomain } from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { type BigNumberish } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { FUND_EXPENDITURE_REQUIRED_ROLE } from '~constants/permissions.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '~redux/sagas/transactions/index.ts';
import { getExpenditureBalancesByTokenAddress } from '~redux/sagas/utils/expenditures.ts';
import {
  getColonyManager,
  getMoveFundsActionDomain,
  getMoveFundsPermissionProofs,
  getPermissionProofsLocal,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '~redux/sagas/utils/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

export type FundExpenditurePayload =
  Action<ActionTypes.MULTISIG_EXPENDITURE_FUND>['payload'];

function* fundExpenditureMultiSig({
  payload: {
    colonyAddress,
    expenditure,
    fromDomainFundingPotId,
    colonyDomains,
    colonyRoles,
    annotationMessage,
  },
  meta,
}: Action<ActionTypes.MULTISIG_EXPENDITURE_FUND>) {
  const colonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );
  const multiSigClient = yield colonyClient.getExtensionClient(
    Extension.MultisigPermissions,
  );

  const { creatingActions, nativeFundingPotId: expenditureFundingPotId } =
    expenditure;

  const batchKey = TRANSACTION_METHODS.FundExpenditure;

  // Create a map between token addresses and the total amount of the payouts for each token
  // We will call one moveFunds method for each token address instead of each payout to save gas
  const balancesByTokenAddresses =
    getExpenditureBalancesByTokenAddress(expenditure);

  // Create channel for each token, using its address as channel id
  const {
    annotateMultiSig,
    createMultiSig,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['createMultiSig', 'annotateMultiSig'],
  );
  const requiredRoles = [FUND_EXPENDITURE_REQUIRED_ROLE];

  try {
    const userAddress = yield colonyClient.signer.getAddress();
    const fromDomainId: BigNumberish = yield getPotDomain(
      colonyClient,
      fromDomainFundingPotId,
    );
    const expenditurePotDomainId: BigNumberish = yield call(
      getPotDomain,
      colonyClient,
      expenditureFundingPotId,
    );

    const actionDomainId = getMoveFundsActionDomain({
      actionDomainId: null,
      fromDomainId,
      toDomainId: expenditurePotDomainId,
    });

    const { fromChildSkillIndex, toChildSkillIndex } = yield call(
      getMoveFundsPermissionProofs,
      {
        actionDomainId,
        toDomainId: expenditurePotDomainId,
        fromDomainId,
        colonyDomains,
        colonyAddress,
      },
    );

    const [multiSigPermissionDomainId, multiSigChildSkillIndex] = yield call(
      getPermissionProofsLocal,
      {
        networkClient: colonyClient.networkClient,
        colonyRoles,
        colonyDomains,
        requiredDomainId: Number(actionDomainId),
        requiredColonyRoles: requiredRoles,
        permissionAddress: multiSigClient.address,
        isMultiSig: false,
      },
    );
    const [userPermissionDomainId, userChildSkillIndex] = yield call(
      getPermissionProofsLocal,
      {
        networkClient: colonyClient.networkClient,
        colonyRoles,
        colonyDomains,
        requiredDomainId: Number(actionDomainId),
        requiredColonyRoles: requiredRoles,
        permissionAddress: userAddress,
        isMultiSig: true,
      },
    );

    const multicallData = [...balancesByTokenAddresses.entries()].map(
      ([tokenAddress, amount]) => {
        return colonyClient.interface.encodeFunctionData(
          'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)',
          [
            multiSigPermissionDomainId,
            multiSigChildSkillIndex,
            actionDomainId,
            fromChildSkillIndex,
            toChildSkillIndex,
            fromDomainFundingPotId,
            expenditureFundingPotId,
            amount,
            tokenAddress,
          ],
        );
      },
    );

    yield fork(createTransaction, createMultiSig.id, {
      context: ClientType.MultisigPermissionsClient,
      methodName: 'createMotion',
      params: [
        userPermissionDomainId,
        userChildSkillIndex,
        multicallData.map(() => AddressZero),
        multicallData,
      ],
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      ready: false,
      associatedActionId: creatingActions?.items[0]?.transactionHash,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateMultiSig.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: 1,
        },
        ready: false,
        associatedActionId: creatingActions?.items[0]?.transactionHash,
      });
    }

    yield takeFrom(createMultiSig.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(annotateMultiSig.channel, ActionTypes.TRANSACTION_CREATED);
    }

    yield initiateTransaction(createMultiSig.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(createMultiSig.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateMultiSig,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.MULTISIG_EXPENDITURE_FUND_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.MULTISIG_EXPENDITURE_FUND_ERROR,
      error,
      meta,
    );
  } finally {
    createMultiSig.channel.close();
    annotateMultiSig.channel.close();
  }

  return null;
}

export default function* fundExpenditureMultiSigSaga() {
  yield takeEvery(
    ActionTypes.MULTISIG_EXPENDITURE_FUND,
    fundExpenditureMultiSig,
  );
}
