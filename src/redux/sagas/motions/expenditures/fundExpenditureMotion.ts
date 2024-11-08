import {
  ClientType,
  Id,
  getChildIndex,
  getPermissionProofs,
  getPotDomain,
} from '@colony/colony-js';
import { constants } from 'ethers';
import { call, put, takeEvery } from 'redux-saga/effects';

import { ADDRESS_ZERO, APP_URL } from '~constants/index.ts';
import { FUND_EXPENDITURE_REQUIRED_ROLE } from '~constants/permissions.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import {
  createGroupTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '~redux/sagas/transactions/index.ts';
import { getExpenditureBalancesByTokenAddress } from '~redux/sagas/utils/expenditures.ts';
import {
  createInvalidParamsError,
  getColonyManager,
  initiateTransaction,
} from '~redux/sagas/utils/index.ts';
import { type Action } from '~redux/types/index.ts';

function* fundExpenditureMotion({
  payload: {
    colony: { colonyAddress },
    expenditure,
    fromDomainFundingPotId,
    motionDomainId,
    fromDomainId,
    /* annotationMessage */
  },
  meta: { setTxHash, id },
  meta,
}: Action<ActionTypes.MOTION_EXPENDITURE_FUND>) {
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
    const requiredRoles = [FUND_EXPENDITURE_REQUIRED_ROLE];

    const [fromPermissionDomainId, fromChildSkillIndex] = yield call(
      getPermissionProofs,
      colonyClient.networkClient,
      colonyClient,
      fromDomainId,
      requiredRoles,
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
      requiredRoles,
      votingReputationClient.address,
    );

    const encodedFundingPotActions = [...balances.entries()].map(
      ([tokenAddress, amount]) =>
        colonyClient.interface.encodeFunctionData(
          'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)',
          [
            fromPermissionDomainId,
            constants.MaxUint256,
            fromPermissionDomainId,
            fromChildSkillIndex,
            toChildSkillIndex,
            fromDomainFundingPotId,
            expenditureFundingPotId,
            amount,
            tokenAddress,
          ],
        ),
    );

    const encodedMulticallAction = colonyClient.interface.encodeFunctionData(
      'multicall(bytes[] calldata)',
      [encodedFundingPotActions],
    );

    const batchKey = 'createMotion';

    yield createGroupTransaction({
      channel: createMotion,
      batchKey,
      meta,
      config: {
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
          key: batchKey,
          id: meta.id,
          index: 1,
        },
      },
    });

    yield initiateTransaction(createMotion.id);

    const {
      type,
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield call(waitForTxResult, createMotion.channel);

    setTxHash?.(txHash);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<Action<ActionTypes.MOTION_EXPENDITURE_FUND_SUCCESS>>({
        type: ActionTypes.MOTION_EXPENDITURE_FUND_SUCCESS,
        meta,
      });

      // @TODO: Remove during advanced payments UI wiring
      // eslint-disable-next-line no-console
      console.log(
        `Fund Expenditure Motion URL: ${APP_URL}${window.location.pathname.slice(
          1,
        )}?tx=${txHash}`,
      );
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
