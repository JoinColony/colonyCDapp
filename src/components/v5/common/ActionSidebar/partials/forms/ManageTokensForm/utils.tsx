import { ADDRESS_ZERO } from '~constants/index.ts';
import { RootMotionMethodNames } from '~redux';
import { getManageTokensOperation } from '~redux/sagas/utils/metadataDelta.ts';
import { type Colony } from '~types/graphql.ts';
import { sanitizeHTML } from '~utils/strings.ts';
import { createAddress } from '~utils/web3/index.ts';

import { type ManageTokensFormValues } from './consts.ts';

export const getManageTokensPayload = (
  colony: Colony,
  values: ManageTokensFormValues,
) => {
  const {
    selectedTokenAddresses,
    description: annotationMessage,
    title,
  } = values;

  const tokenAddresses = [
    ...new Set(
      selectedTokenAddresses
        .map(({ token }) => createAddress(token))
        .filter((address) => {
          return (
            address !== ADDRESS_ZERO &&
            address !== colony.nativeToken.tokenAddress
          );
        }),
    ),
  ];

  const motionParams = [
    JSON.stringify(getManageTokensOperation(tokenAddresses)),
  ];

  return {
    operationName: RootMotionMethodNames.EditColonyByDelta,
    motionParams,
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    tokenAddresses,
    annotationMessage: annotationMessage
      ? sanitizeHTML(annotationMessage)
      : undefined,
    customActionTitle: title,
  };
};
