import { utils } from 'ethers';

import { ContractRevertErrors, TRANSACTION_METHODS } from '~types';
import { intl } from '~utils/intl';

const { formatMessage } = intl({
  'error.unknown': 'Unknown broadcaster error',
  'error.tokenLocked': 'Colony Token locked and cannot be activated',
  'error.invalidSignature': `Invalid Metatransaction signature sent to the broadcaster`,
});

export const generateBroadcasterHumanReadableError = (
  methodName?: string,
  error?: { reason?: string },
  response?: {
    payload?: string;
    reason?: string;
  },
): string => {
  let errorMessage =
    error?.reason ||
    response?.reason ||
    response?.payload ||
    formatMessage({ id: 'error.unknown' });

  /*
   * @NOTE Account for error reasons encoded as hex strings
   * From RPC endpoints like Nethermind
   */
  const [, foundHexString] = response?.reason?.match(/(0x.*)/) || [];
  const isHexReason = foundHexString && utils.isHexString(foundHexString);
  const hexReasonValue = isHexReason
    ? Buffer.from(
        foundHexString.slice(2), // remove the '0x` prefix
        'hex',
      ).toString()
    : '';

  if (
    (methodName === TRANSACTION_METHODS.Approve &&
      response?.reason?.includes(ContractRevertErrors.TokenUnauthorized)) ||
    hexReasonValue.includes(ContractRevertErrors.TokenUnauthorized)
  ) {
    errorMessage = formatMessage({ id: 'error.tokenLocked' });
    return errorMessage;
  }

  if (
    response?.reason?.includes(ContractRevertErrors.MetaTxInvalidSignature) ||
    hexReasonValue.includes(ContractRevertErrors.MetaTxInvalidSignature) ||
    response?.reason?.includes(ContractRevertErrors.TokenInvalidSignature) ||
    hexReasonValue.includes(ContractRevertErrors.TokenInvalidSignature)
  ) {
    errorMessage = formatMessage({ id: 'error.invalidSignature' });
    return errorMessage;
  }

  /*
   * @NOTE If the error in unknown _(we didn't trigger the previous logic checks)_
   * make sure to log it out so we can debug it
   */
  console.error(
    errorMessage,
    `Reponse: ${response?.payload} ${response?.reason}`,
    `Decoded: ${hexReasonValue}`,
  );
  return errorMessage;
};
