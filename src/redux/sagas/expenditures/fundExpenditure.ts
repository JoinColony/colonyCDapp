import { ClientType, getPotDomain } from '@colony/colony-js';
import { type BigNumberish } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { FUND_EXPENDITURE_REQUIRED_ROLE } from '~constants/permissions.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import { getExpenditureBalancesByTokenAddress } from '../utils/expenditures.ts';
import {
  getColonyManager,
  getMoveFundsActionDomain,
  getMoveFundsPermissionProofs,
  getPermissionProofsLocal,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';

export type FundExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_FUND>['payload'];

function* fundExpenditure({
  payload: {
    colonyAddress,
    expenditure,
    fromDomainFundingPotId,
    colonyDomains,
    colonyRoles,
    annotationMessage,
  },
  meta,
}: Action<ActionTypes.EXPENDITURE_FUND>) {
  const colonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const { nativeFundingPotId: expenditureFundingPotId } = expenditure;

  const batchKey = TRANSACTION_METHODS.FundExpenditure;

  // Create a map between token addresses and the total amount of the payouts for each token
  // We will call one moveFunds method for each token address instead of each payout to save gas
  const balancesByTokenAddresses =
    getExpenditureBalancesByTokenAddress(expenditure);

  // Create channel for each token, using its address as channel id
  const {
    annotateFundExpenditure,
    fundMulticall,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['fundMulticall', 'annotateFundExpenditure'],
  );

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

    const [userPermissionDomainId, userChildSkillIndex] = yield call(
      getPermissionProofsLocal,
      {
        networkClient: colonyClient.networkClient,
        colonyRoles,
        colonyDomains,
        requiredDomainId: Number(actionDomainId),
        requiredColonyRoles: [FUND_EXPENDITURE_REQUIRED_ROLE],
        permissionAddress: userAddress,
      },
    );

    /*
     * What are the parameters passed here?
     * 1. The domain where the user/extension has permissions in
     * 2. The child skill index, so MaxUint256 if it's in the same domain, or the index of the child domain in the parent's subdomains
     * 3. The domainId where the action is happening (parent domain, except when moving funds between the same domain, then it's that domain)
     * 4. The fromChildSkillIndex in relation to domain from point 3(!!!) which should be MaxUint256
     * if we are moving funds from the same domain, or the appropriate childSkillIndex if we are moving funds
     * from a subdomain of domain from point 3
     * 5. The toChildSkillIndex in relation to domain from point 3(!!!) which should be MaxUint256
     * if we are moving funds to the same domain, or the appropriate childSkillIndex if
     * we are moving funds from a subdomain of domain from point 3
     * 6-8 are self explanatory, the first 4 are the tricky ones
     */
    const multicallData = [...balancesByTokenAddresses.entries()].map(
      ([tokenAddress, amount]) =>
        colonyClient.interface.encodeFunctionData(
          'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)',
          [
            userPermissionDomainId,
            userChildSkillIndex,
            actionDomainId,
            fromChildSkillIndex,
            toChildSkillIndex,
            fromDomainFundingPotId,
            expenditureFundingPotId,
            amount,
            tokenAddress,
          ],
        ),
    );

    yield fork(createTransaction, fundMulticall.id, {
      context: ClientType.ColonyClient,
      methodName: 'multicall',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      ready: false,
      params: [multicallData],
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateFundExpenditure.id, {
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

    yield takeFrom(fundMulticall.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateFundExpenditure.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction(fundMulticall.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(fundMulticall.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateFundExpenditure,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_FUND_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_FUND_ERROR, error, meta);
  } finally {
    fundMulticall.channel.close();
    annotateFundExpenditure.channel.close();
  }

  return null;
}

export default function* fundExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_FUND, fundExpenditure);
}
