import {
  ClientType,
  ColonyRole,
  Id,
  getChildIndex,
  getPermissionProofs,
  getPotDomain,
} from '@colony/colony-js';
import { constants } from 'ethers';

import { call, put, takeEvery } from 'redux-saga/effects';
import { ADDRESS_ZERO } from '~constants';
import { ActionTypes } from '~redux/actionTypes';
import { getExpenditureBalancesByTokenAddress } from '~redux/sagas/utils/expenditures';
import {
  createGroupTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '~redux/sagas/transactions';
import {
  createInvalidParamsError,
  getColonyManager,
  initiateTransaction,
  takeFrom,
} from '~redux/sagas/utils';
import { Action } from '~redux/types';

function* fundExpenditureMotion({
  payload: {
    colony: { colonyAddress, version: colonyVersion },
    expenditure,
    fromDomainFundingPotId,
    motionDomainId,
    fromDomainId,
    /* annotationMessage */
  },
  meta: { setTxHash, id },
  meta,
}: Action<ActionTypes.MOTION_EXPENDITURE_FUND>) {
  const batchId = 'motion-fund-expenditures';
  const { createMotion /* annotationMessage */ } = yield call(
    createTransactionChannels,
    id,
    ['createMotion', 'annotateMotion'],
  );

  try {
    const sagaName = fundExpenditureMotion.name;

    if (
      !fromDomainId ||
      !colonyAddress ||
      !expenditure ||
      !fromDomainFundingPotId ||
      !motionDomainId
    ) {
      const paramDescription =
        (!fromDomainId &&
          'The domain id the expenditure is being funded from') ||
        (!colonyAddress && 'Colony address') ||
        (!expenditure && 'The expenditure being funded') ||
        (!fromDomainFundingPotId &&
          'The domain funding pot id from which the expenditure will be funded') ||
        (!motionDomainId &&
          'The id of the domain the motion is taking place in');
      throw createInvalidParamsError(sagaName, paramDescription as string);
    }

    const { nativeFundingPotId: expenditureFundingPotId } = expenditure;

    const colonyManager = yield call(getColonyManager);
    const colonyClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.ColonyClient,
      colonyAddress,
    );
    const votingReputationClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const childSkillIndex = yield call(
      getChildIndex,
      colonyClient.networkClient,
      colonyClient,
      motionDomainId,
      fromDomainId,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      Id.RootDomain,
    );

    const { key, value, branchMask, siblings } = yield call(
      [colonyClient, colonyClient.getReputation],
      skillId,
      ADDRESS_ZERO,
    );

    const balances = getExpenditureBalancesByTokenAddress(expenditure);

    const isOldVersion = colonyVersion <= 6;
    const contractMethod = isOldVersion
      ? 'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,address)'
      : 'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)';

    const [fromPermissionDomainId, fromChildSkillIndex] = yield call(
      getPermissionProofs,
      colonyClient.networkClient,
      colonyClient,
      fromDomainId,
      [ColonyRole.Funding],
      votingReputationClient.address,
    );

    const expenditurePotDomain = yield call(
      getPotDomain,
      colonyClient,
      expenditureFundingPotId,
    );

    const [, toChildSkillIndex] = yield call(
      getPermissionProofs,
      colonyClient.networkClient,
      colonyClient,
      expenditurePotDomain,
      [ColonyRole.Funding],
      votingReputationClient.address,
    );

    const encodedFundingPotActions = [...balances.entries()].map(
      ([tokenAddress, amount]) =>
        colonyClient.interface.encodeFunctionData(contractMethod, [
          ...(isOldVersion
            ? []
            : [fromPermissionDomainId, constants.MaxUint256]),
          fromPermissionDomainId,
          fromChildSkillIndex,
          toChildSkillIndex,
          fromDomainFundingPotId,
          expenditureFundingPotId,
          amount,
          tokenAddress,
        ]),
    );

    const encodedMulticallAction = colonyClient.interface.encodeFunctionData(
      'multicall(bytes[] calldata)',
      [encodedFundingPotActions],
    );

    yield createGroupTransaction(createMotion, batchId, meta, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        childSkillIndex,
        ADDRESS_ZERO,
        encodedMulticallAction,
        key,
        value,
        branchMask,
        siblings,
      ],
      group: {
        title: { id: 'transaction.group.createMotion.title' },
        description: {
          id: 'transaction.group.createMotion.description',
        },
      },
    });

    yield initiateTransaction({ id: createMotion.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);

    const { type } = yield call(waitForTxResult, createMotion.channel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<Action<ActionTypes.MOTION_EXPENDITURE_FUND_SUCCESS>>({
        type: ActionTypes.MOTION_EXPENDITURE_FUND_SUCCESS,
        meta,
      });
    }
  } catch (e) {
    console.error(e);
    yield put<Action<ActionTypes.MOTION_EXPENDITURE_FUND_ERROR>>({
      type: ActionTypes.MOTION_EXPENDITURE_FUND_ERROR,
      payload: {
        name: ActionTypes.MOTION_EXPENDITURE_FUND_ERROR,
        message: JSON.stringify(e),
      },
      meta,
      error: true,
    });
  } finally {
    createMotion.channel.close();
  }
  // @todo add annotation logic post-rebase on master
}

export default function* fundExpenditureMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_EXPENDITURE_FUND, fundExpenditureMotion);
}
