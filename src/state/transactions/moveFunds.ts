// import { randomUUID } from 'crypto';
// import { type BigNumber } from 'ethers';
//
// import { createActionMetadataInDb__NEW } from '~redux/sagas/utils/createActionMetadata.ts';
// import { type Domain } from '~types/graphql.ts';
// import { type Address } from '~types/index.ts';
//
// import {
//   colonyManager,
//   useTransactionsStore,
//   TxStatus,
// } from '../transactions.ts';
//
// export const moveFunds = async (
//   {
//     colonyAddress,
//     colonyName,
//     fromDomain,
//     toDomain,
//     amount,
//     tokenAddress,
//     annotationMessage,
//     customActionTitle,
//   }: {
//     colonyAddress: Address;
//     customActionTitle: string;
//     colonyName?: string;
//     tokenAddress: Address;
//     fromDomain: Domain;
//     toDomain: Domain;
//     amount: BigNumber;
//     annotationMessage?: string;
//   },
//   { setTxHash, navigate },
// ) => {
//   /*
//    * Validate the required values for the payment
//    */
//   if (!fromDomain) {
//     throw new Error(
//       'Source domain not set for moveFundsBetweenPots transaction',
//     );
//   }
//   if (!toDomain) {
//     throw new Error(
//       'Recipient domain not set for moveFundsBetweenPots transaction',
//     );
//   }
//   if (!amount) {
//     throw new Error(
//       'Payment amount not set for moveFundsBetweenPots transaction',
//     );
//   }
//   if (!tokenAddress) {
//     throw new Error(
//       'Payment token not set for moveFundsBetweenPots transaction',
//     );
//   }
//
//   const { nativeId: fromTeam } = fromDomain;
//   const { nativeId: toTeam } = toDomain;
//
//   // setup batch id
//   const batchKey = 'moveFunds';
//
//   const moveFundsId = randomUUID();
//   const annotateMoveFundsId = randomUUID();
//
//   useTransactionsStore.setState((state) => {
//     state.transactions.push({
//       id: moveFundsId,
//       // We could use an enum here ORR maybe do something smart with colony SDK
//       name: 'moveFundsBetweenPots',
//       group: {
//         key: batchKey,
//         index: 0,
//       },
//       status: TxStatus.Ready,
//     });
//     state.transactions.push({
//       id: annotateMoveFundsId,
//       // We could use an enum here ORR maybe do something smart with colony SDK
//       name: 'annotateTransaction',
//       group: {
//         key: batchKey,
//         index: 1,
//       },
//       status: TxStatus.Created,
//     });
//   });
//
//   const colony = await colonyManager.getColony(colonyAddress);
//
//   if (!colony) {
//     throw new Error(`Colony with address ${colonyAddress} not found`);
//   }
//
//   const [{ hash }, waitForMoveFunds] = await colony
//     .moveFundsToTeam(amount, toTeam, fromTeam, tokenAddress)
//     .tx()
//     .send();
//
//   useTransactionsStore.setState((state) => {
//     const tx = state.transactions.find(({ id }) => id === moveFundsId);
//     if (tx) {
//       tx.status = TxStatus.Ready;
//     }
//   });
//
//   await createActionMetadataInDb__NEW(hash, customActionTitle);
//
//   if (annotationMessage) {
//     await colony
//       .annotateTransaction(hash, { annotationMsg: annotationMessage })
//       .tx()
//       .mined();
//   }
//
//   // This is probably mined by now, just for good measure we'll wait for it
//   await waitForMoveFunds();
//
//   useTransactionsStore.setState((state) => {
//     const moveFundsTx = state.transactions.find(({ id }) => id === moveFundsId);
//     if (moveFundsTx) {
//       moveFundsTx.status = TxStatus.Mined;
//     }
//     const annotateTx = state.transactions.find(
//       ({ id }) => id === annotateMoveFundsId,
//     );
//     if (annotateTx) {
//       annotateTx.status = TxStatus.Mined;
//     }
//   });
//
//   setTxHash?.(hash);
//
//   if (colonyName && navigate) {
//     navigate(`/${colonyName}?tx=${hash}`, {
//       state: { isRedirect: true },
//     });
//   }
// };

// function* createMoveFundsAction({
//   payload: {
//     colonyAddress,
//     colonyName,
//     fromDomain,
//     toDomain,
//     amount,
//     tokenAddress,
//     annotationMessage,
//     customActionTitle,
//   },
//   meta: { id: metaId, navigate, setTxHash },
//   meta,
// }: Action<ActionTypes.ACTION_MOVE_FUNDS>) {
//   let txChannel;
//   try {
//     /*
//      * Validate the required values for the payment
//      */
//     if (!fromDomain) {
//       throw new Error(
//         'Source domain not set for moveFundsBetweenPots transaction',
//       );
//     }
//     if (!toDomain) {
//       throw new Error(
//         'Recipient domain not set for moveFundsBetweenPots transaction',
//       );
//     }
//     if (!amount) {
//       throw new Error(
//         'Payment amount not set for moveFundsBetweenPots transaction',
//       );
//     }
//     if (!tokenAddress) {
//       throw new Error(
//         'Payment token not set for moveFundsBetweenPots transaction',
//       );
//     }
//
//     const { nativeFundingPotId: fromPot } = fromDomain;
//     const { nativeFundingPotId: toPot } = toDomain;
//
//     // setup batch id
//     const batchKey = 'moveFunds';
//
//     yield fork(createTransaction, moveFunds.id, {
//       context: ClientType.ColonyClient,
//       methodName:
//         'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,address)',
//       identifier: colonyAddress,
//       params: [],
//       group: {
//         key: batchKey,
//         id: metaId,
//         index: 0,
//       },
//       ready: false,
//     });
//
//     if (annotationMessage) {
//       yield fork(createTransaction, annotateMoveFunds.id, {
//         context: ClientType.ColonyClient,
//         methodName: 'annotateTransaction',
//         identifier: colonyAddress,
//         params: [],
//         group: {
//           key: batchKey,
//           id: metaId,
//           index: 1,
//         },
//         ready: false,
//       });
//     }
//
//     yield takeFrom(moveFunds.channel, ActionTypes.TRANSACTION_CREATED);
//
//     if (annotationMessage) {
//       yield takeFrom(
//         annotateMoveFunds.channel,
//         ActionTypes.TRANSACTION_CREATED,
//       );
//     }
//
//     yield put(transactionPending(moveFunds.id));
//
//     const [permissionDomainId, fromChildSkillIndex, toChildSkillIndex] =
//       yield getMoveFundsPermissionProofs(colonyAddress, fromPot, toPot);
//
//     yield put(
//       transactionAddParams(moveFunds.id, [
//         permissionDomainId,
//         fromChildSkillIndex,
//         toChildSkillIndex,
//         fromPot,
//         toPot,
//         amount,
//         tokenAddress,
//       ]),
//     );
//
//     yield initiateTransaction({ id: moveFunds.id });
//
//     const {
//       payload: {
//         receipt: { transactionHash: txHash },
//       },
//     } = yield waitForTxResult(moveFunds.channel);
//
//     yield createActionMetadataInDB(txHash, customActionTitle);
//
//     if (annotationMessage) {
//       yield uploadAnnotation({
//         txChannel: annotateMoveFunds,
//         message: annotationMessage,
//         txHash,
//       });
//     }
//
//     setTxHash?.(txHash);
//
//     yield put<AllActions>({
//       type: ActionTypes.ACTION_MOVE_FUNDS_SUCCESS,
//       meta,
//     });
//
//     if (colonyName && navigate) {
//       navigate(`/${colonyName}?tx=${txHash}`, {
//         state: { isRedirect: true },
//       });
//     }
//   } catch (caughtError) {
//     yield putError(ActionTypes.ACTION_MOVE_FUNDS_ERROR, caughtError, meta);
//   } finally {
//     txChannel.close();
//   }
// }
//
// export default function* moveFundsActionSaga() {
//   yield takeEvery(ActionTypes.ACTION_MOVE_FUNDS, createMoveFundsAction);
// }
