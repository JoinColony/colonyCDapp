import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { type TestContext } from 'yup';

import { type ColonyFragment } from '~gql';
import {
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';

export const amountGreaterThanValidation = ({
  value,
  context,
  colony,
  tokenAddress,
  greaterThanValue,
}: {
  value: string | null | undefined;
  context: TestContext<object>;
  colony: ColonyFragment;
  tokenAddress?: string;
  greaterThanValue: string;
}) => {
  if (!value) {
    return false;
  }

  const { parent } = context;
  const { tokenAddress: tokenAddressFieldValue } = parent || {};

  const selectedToken = getSelectedToken(
    colony,
    tokenAddress || tokenAddressFieldValue,
  );

  return BigNumber.from(
    moveDecimal(
      value === '' ? '0' : value,
      getTokenDecimalsWithFallback(selectedToken?.decimals),
    ),
  ).gt(greaterThanValue);
};
