import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { BigNumber, utils } from 'ethers';

import { Action, ActionTypes, AllActions } from '~redux';
import { ExpenditurePayoutFieldValue } from '~common/Expenditures/ExpenditureForm';
import { ColonyManager } from '~context';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';

import {
  putError,
  initiateTransaction,
  getColonyManager,
  getPayoutsWithSlotIds,
} from '../utils';
import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions';

function toB32(input) {
  return utils.hexZeroPad(utils.hexlify(input), 32);
}

function* editLockedExpenditure({
  payload: { colonyAddress, expenditure, payouts },
  meta,
}: Action<ActionTypes.EXPENDITURE_LOCKED_EDIT>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const txChannel = yield call(getTxChannel, meta.id);

  const payoutsWithSlotIds = getPayoutsWithSlotIds(payouts);

  /**
   * @NOTE: Resolving payouts means making sure that for every slot, there's only one payout with non-zero amount.
   * This is to meet the UI requirement that there should be one payout per row.
   */
  const resolvedPayouts: ExpenditurePayoutFieldValue[] = [];

  payoutsWithSlotIds.forEach((payout) => {
    // Add payout as specified in the form
    resolvedPayouts.push(payout);

    const existingSlot = expenditure.slots.find(
      (slot) => slot.id === payout.slotId,
    );

    // Set the amounts for any existing payouts in different tokens to 0
    resolvedPayouts.push(
      ...(existingSlot?.payouts
        ?.filter(
          (slotPayout) =>
            slotPayout.tokenAddress !== payout.tokenAddress &&
            BigNumber.from(slotPayout.amount).gt(0),
        )
        .map((slotPayout) => ({
          slotId: payout.slotId,
          recipientAddress: payout.recipientAddress,
          tokenAddress: slotPayout.tokenAddress,
          amount: '0',
          claimDelay: payout.claimDelay,
        })) ?? []),
    );
  });

  // If there are now less payouts than expenditure slots, we need to remove them by setting their amounts to 0
  const remainingSlots = expenditure.slots.slice(payouts.length);
  remainingSlots.forEach((slot) => {
    slot.payouts?.forEach((payout) => {
      resolvedPayouts.push({
        slotId: slot.id,
        recipientAddress: slot.recipientAddress ?? '',
        tokenAddress: payout.tokenAddress,
        amount: '0',
        claimDelay: slot.claimDelay ?? 0,
      });
    });
  });

  try {
    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient,
      expenditure.nativeDomainId,
      ColonyRole.Administration,
    );

    const encodedMulticallData: string[] = [];

    resolvedPayouts.forEach((payout) => {
      // Set recipient
      encodedMulticallData.push(
        colonyClient.interface.encodeFunctionData('setExpenditureState', [
          permissionDomainId,
          childSkillIndex,
          expenditure.nativeId,
          BigNumber.from(26),
          [false, true],
          [toB32(payout.slotId), toB32(BigNumber.from(0))],
          toB32(payout.recipientAddress),
        ]),
      );

      // Set token address and amount
      encodedMulticallData.push(
        colonyClient.interface.encodeFunctionData(
          'setExpenditurePayout(uint256,uint256,uint256,uint256,address,uint256)',
          [
            permissionDomainId,
            childSkillIndex,
            expenditure.nativeId,
            payout.slotId,
            payout.tokenAddress,
            BigNumber.from(payout.amount).mul(
              // @TODO: This should get the token decimals of the selected token
              BigNumber.from(10).pow(DEFAULT_TOKEN_DECIMALS),
            ),
          ],
        ),
      );
    });

    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'multicall',
      identifier: colonyAddress,
      params: [encodedMulticallData],
    });

    yield initiateTransaction({ id: meta.id });

    const { type } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<AllActions>({
        type: ActionTypes.EXPENDITURE_LOCKED_EDIT_SUCCESS,
        payload: {},
        meta,
      });
    }
  } catch (error) {
    console.error(error);
    return yield putError(
      ActionTypes.EXPENDITURE_LOCKED_EDIT_ERROR,
      error,
      meta,
    );
  }

  txChannel.close();

  return null;
}

export default function* editLockedExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_LOCKED_EDIT, editLockedExpenditure);
}
