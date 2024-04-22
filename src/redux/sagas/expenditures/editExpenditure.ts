import { type AnyColonyClient, ClientType } from '@colony/colony-js';
import { JsonRpcProvider, TransactionReceipt } from '@ethersproject/providers';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context';
import { ExpenditureStatus, ExpenditureType } from '~gql';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  putError,
  getSetExpenditureValuesFunctionParams,
  initiateTransaction,
  takeFrom,
  uploadAnnotation,
  getColonyManager,
  getMulticallDataForUpdatedPayouts,
  getResolvedPayouts,
} from '../utils/index.ts';

const processTrace = (sj: any, receipt: TransactionReceipt, input: any) => {
  // const sj = JSON.parse(s);

  const frames = sj.structLogs.filter((x) =>
    // const frames = sj.result.structLogs.filter((x) =>
    ['CALL', 'DELEGATECALL', 'STATICCALL', 'RETURN'].includes(x.op),
  );

  // get from, to, input from tx
  const stack = {
    from: receipt.from,
    to: receipt.to,
    input,
    calls: [],
  };

  const callHistory = [];

  let currentPositionInStack = stack;
  // eslint-disable-next-line no-restricted-syntax
  for (const f of frames) {
    if (f.op === 'CALL') {
      // console.log(`CALL to ${f.stack[f.stack.length - 2]}`);
      const offset = parseInt(f.stack[f.stack.length - 4], 16);
      const size = parseInt(f.stack[f.stack.length - 5], 16);
      const data = f.memory.join('').slice(offset * 2, (offset + size) * 2);
      // console.log(`with call data 0x${data}`);
      // @ts-ignore
      currentPositionInStack.calls.push({
        from: currentPositionInStack.to,
        to: `0x${f.stack[f.stack.length - 2].slice(-40)}`,
        input: `0x${data}`,
        calls: [],
        type: 'CALL',
      });
      // @ts-ignore
      callHistory.push(currentPositionInStack);
      currentPositionInStack =
        currentPositionInStack.calls[currentPositionInStack.calls.length - 1];
    }
    if (f.op === 'DELEGATECALL') {
      // console.log(`DELEGATECALL to ${f.stack[f.stack.length - 2]}`);
      const offset = parseInt(f.stack[f.stack.length - 3], 16);
      const size = parseInt(f.stack[f.stack.length - 4], 16);
      const data = f.memory.join('').slice(offset * 2, (offset + size) * 2);
      // console.log(`with call data 0x${data}`);
      // @ts-ignore
      currentPositionInStack.calls.push({
        from: currentPositionInStack.to,
        to: `0x${f.stack[f.stack.length - 2].slice(-40)}`,
        input: `0x${data}`,
        calls: [],
        type: 'DELEGATECALL',
      });
      // A delegate call shouldn't change where we call from in the future.
    }
    if (f.op === 'STATICCALL') {
      // console.log(`STATICCALL to ${f.stack[f.stack.length - 2]}`);
      const offset = parseInt(f.stack[f.stack.length - 3], 16);
      const size = parseInt(f.stack[f.stack.length - 4], 16);
      const data = f.memory.join('').slice(offset * 2, (offset + size) * 2);
      // console.log(`with call data 0x${data}`);
      // process.exit(1);
      // @ts-ignore
      currentPositionInStack.calls.push({
        from: currentPositionInStack.to,
        to: `0x${f.stack[f.stack.length - 2].slice(-40)}`,
        input: `0x${data}`,
        calls: [],
        type: 'STATICCALL',
      });
      // @ts-ignore
      callHistory.push(currentPositionInStack);
      currentPositionInStack =
        currentPositionInStack.calls[currentPositionInStack.calls.length - 1];
    }
    if (f.op === 'RETURN') {
      if (callHistory.length === 0) {
        break;
      }
      // @ts-ignore
      currentPositionInStack = callHistory.pop();
    }
  }

  console.log(JSON.stringify(stack, null, 2));
};

export type EditExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_EDIT>['payload'];

function* editExpenditureAction({
  payload: {
    colonyAddress,
    expenditure,
    payouts,
    networkInverseFee,
    annotationMessage,
    userAddress,
  },
  meta,
}: Action<ActionTypes.EXPENDITURE_EDIT>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient: AnyColonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const batchKey = 'createExpenditure';

  const resolvedPayouts = getResolvedPayouts(payouts, expenditure);

  const {
    editExpenditure,
    annotateEditExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['editExpenditure', 'annotateEditExpenditure'],
  );

  try {
    if (
      expenditure.ownerAddress === userAddress &&
      expenditure.status === ExpenditureStatus.Draft
    ) {
      // `setExpenditureValues` can only be used if the user is the owner and the expenditure is draft
      yield fork(createTransaction, editExpenditure.id, {
        context: ClientType.ColonyClient,
        methodName: 'setExpenditureValues',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: 0,
        },
        params: getSetExpenditureValuesFunctionParams(
          expenditure.nativeId,
          resolvedPayouts,
          networkInverseFee,
          expenditure.type === ExpenditureType.Staged,
        ),
      });
    } else {
      const multicallData = yield getMulticallDataForUpdatedPayouts(
        expenditure,
        resolvedPayouts,
        colonyClient,
        networkInverseFee,
      );

      yield fork(createTransaction, editExpenditure.id, {
        context: ClientType.ColonyClient,
        methodName: 'multicall',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: 0,
        },
        params: [multicallData],
      });
    }

    if (annotationMessage) {
      yield fork(createTransaction, annotateEditExpenditure.id, {
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

    yield takeFrom(editExpenditure.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateEditExpenditure.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction({ id: editExpenditure.id });
    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      editExpenditure.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    const {
      payload: { receipt },
    } = yield takeFrom(
      editExpenditure.channel,
      ActionTypes.TRANSACTION_RECEIPT_RECEIVED,
    );

    const provider = new JsonRpcProvider();
    const tx = yield provider.getTransaction(txHash);
    console.log(tx);

    const data = yield provider.send('debug_traceTransaction', [txHash]);
    console.log(data);
    processTrace(data, receipt, tx.data);

    yield waitForTxResult(editExpenditure.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateEditExpenditure,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_EDIT_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_EDIT_ERROR, error, meta);
  }

  [editExpenditure, annotateEditExpenditure].forEach((channel) =>
    channel.channel.close(),
  );

  return null;
}

export default function* editExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_EDIT, editExpenditureAction);
}
