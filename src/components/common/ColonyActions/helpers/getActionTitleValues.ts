// import {
//   ExtendedColonyActionType,
//   type AnyActionType,
// } from '~types/actions.ts';
// import {
//   type ColonyAction,
//   ColonyActionType,
//   type Colony,
//   type Expenditure,
// } from '~types/graphql.ts';
// import {
//   getExtendedActionType,
//   safeActionTypes,
// } from '~utils/colonyActions.ts';
//
// import { generateMessageValues } from './getEventTitleValues.ts';
// import { mapColonyActionToExpectedFormat } from './mapItemToMessageFormat.tsx';
//
// import type React from 'react';

// FIXME: DO_NEXT move this to actions!!!
/* Returns the correct message values according to the action type. */
// const getActionTitleValues = ({
//   actionData,
//   colony,
//   keyFallbackValues,
//   expenditureData,
// }: {
//   actionData: ColonyAction;
//   colony: Pick<Colony, 'metadata' | 'nativeToken'>;
//   keyFallbackValues?: Partial<Record<ActionTitleMessageKeys, React.ReactNode>>;
//   expenditureData?: Expenditure;
// }) => {
//   const { isMotion, pendingColonyMetadata } = actionData;
//
//   const updatedItem = mapColonyActionToExpectedFormat({
//     actionData,
//     colony,
//     keyFallbackValues,
//     expenditureData,
//   });
//
//   const actionType = getExtendedActionType(
//     actionData,
//     isMotion ? pendingColonyMetadata : colony.metadata,
//   );
//   const keys = getMessageDescriptorKeys(actionType);
//
//   return generateMessageValues(updatedItem, keys, {
//     actionType,
//   });
// };

// export default getActionTitleValues;
