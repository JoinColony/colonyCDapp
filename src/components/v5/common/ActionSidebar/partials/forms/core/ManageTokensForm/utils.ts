import { ADDRESS_ZERO } from '~constants/index.ts';
import { DecisionMethod } from '~gql';
import { type Colony } from '~types/graphql.ts';
import { getMotionPayload } from '~utils/motions.ts';
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
    decisionMethod,
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

  const commonPayload = {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    tokenAddresses,
    annotationMessage: annotationMessage
      ? sanitizeHTML(annotationMessage)
      : undefined,
    customActionTitle: title,
  };

  if (
    decisionMethod === DecisionMethod.Reputation ||
    decisionMethod === DecisionMethod.MultiSig
  ) {
    return {
      ...commonPayload,
      ...getMotionPayload(decisionMethod === DecisionMethod.MultiSig, colony),
    };
  }

  return commonPayload;
};
