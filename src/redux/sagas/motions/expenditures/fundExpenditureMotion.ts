import { ClientType, Extension, getPotDomain } from '@colony/colony-js';
import { BigNumber, constants, type BigNumberish } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { FUND_EXPENDITURE_REQUIRED_ROLE } from '~constants/permissions.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import {
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
import { type Action } from '~redux/types/index.ts';

function* fundExpenditureMotion({
  payload: {
    colonyAddress,
    expenditure,
    fromDomainFundingPotId,
    colonyDomains,
    colonyRoles,
    annotationMessage,
    motionDomainId,
  },
  meta,
}: Action<ActionTypes.MOTION_EXPENDITURE_FUND>) {
  const { createMotion, annotateMotion } = yield call(
    createTransactionChannels,
    meta.id,
    ['createMotion', 'annotateMotion'],
  );

  try {
    const balances = getExpenditureBalancesByTokenAddress(expenditure);
    const { nativeFundingPotId: expenditureFundingPotId, creatingActions } =
      expenditure;

    const colonyManager = yield call(getColonyManager);
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    const votingReputationClient = yield colonyClient.getExtensionClient(
      Extension.VotingReputation,
    );

    const fromDomainId: BigNumberish = yield getPotDomain(
      colonyClient,
      fromDomainFundingPotId,
    );
    const expenditurePotDomainId: BigNumberish = yield call(
      getPotDomain,
      colonyClient,
      expenditureFundingPotId,
    );

    // this will basically just run motionDomainId through inheritance validation
    const actionDomainId = getMoveFundsActionDomain({
      actionDomainId: motionDomainId,
      fromDomainId,
      toDomainId: expenditurePotDomainId,
    });

    const requiredRoles = [FUND_EXPENDITURE_REQUIRED_ROLE];

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

    const [votRepPermissionDomainId, votRepChildSkillIndex] = yield call(
      getPermissionProofsLocal,
      {
        networkClient: colonyClient.networkClient,
        colonyRoles,
        colonyDomains,
        requiredDomainId: Number(actionDomainId),
        requiredColonyRoles: requiredRoles,
        permissionAddress: votingReputationClient.address,
        isMultiSig: false,
      },
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      actionDomainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      [colonyClient, colonyClient.getReputation],
      skillId,
      ADDRESS_ZERO,
    );

    const encodedFundingPotActions = [...balances.entries()].map(
      ([tokenAddress, amount]) => {
        return colonyClient.interface.encodeFunctionData(
          'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)',
          [
            votRepPermissionDomainId,
            votRepChildSkillIndex,
            BigNumber.from(actionDomainId),
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

    const encodedMulticallAction = colonyClient.interface.encodeFunctionData(
      'multicall(bytes[] calldata)',
      [encodedFundingPotActions],
    );

    const batchKey = 'createMotion';

    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      params: [
        actionDomainId,
        constants.MaxUint256,
        ADDRESS_ZERO,
        encodedMulticallAction,
        key,
        value,
        branchMask,
        siblings,
      ],
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      ready: false,
      associatedActionId: creatingActions?.items[0]?.transactionHash ?? '',
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateMotion.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(annotateMotion.channel, ActionTypes.TRANSACTION_CREATED);
    }

    yield initiateTransaction(createMotion.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield call(waitForTxResult, createMotion.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateMotion,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<Action<ActionTypes.MOTION_EXPENDITURE_FUND_SUCCESS>>({
      type: ActionTypes.MOTION_EXPENDITURE_FUND_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.MOTION_EXPENDITURE_FUND_ERROR,
      error,
      meta,
    );
  } finally {
    createMotion.channel.close();
    annotateMotion.channel.close();
  }

  return null;
}

export default function* fundExpenditureMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_EXPENDITURE_FUND, fundExpenditureMotion);
}
