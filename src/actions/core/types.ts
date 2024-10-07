// import { ColonyActionType } from '~gql';

export enum CoreActionGroup {
  BatchPayment = 'BATCH_PAYMENT',
  /*
   * @deprecated Technically deprecated but still needed for compatibility reasons
   */
  UpdateColonyObjective = 'UPDATE_COLONY_OBJECTIVE',
  ManageReputation = 'MANAGE_REPUTATION',
  ManageVerifiedMembers = 'MANAGE_VERIFIED_MEMBERS',
  SplitPayment = 'SPLIT_PAYMENT',
  StagedPayment = 'STAGED_PAYMENT',
  StreamingPayment = 'STREAMING_PAYMENT',
}

export { ColonyActionType as CoreAction } from '~gql';

// export const CoreAction = { ...ColonyActionType, ...CoreActionGroup };
// // FIXME: This is fine, add a comment
// export type CoreAction = typeof CoreAction;
