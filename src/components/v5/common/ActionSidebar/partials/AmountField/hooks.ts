import { type FormatNumeralOptions } from 'cleave-zen';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { notNull } from '~utils/arrays/index.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import { CHAIN_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';

export const useAmountField = (selectedTokenAddress: string | undefined) => {
  const { colony } = useColonyContext();
  const { watch } = useFormContext();
  const chainId = watch(CHAIN_FIELD_NAME) ?? DEFAULT_NETWORK_INFO.chainId;

  const colonyTokens =
    colony.tokens?.items
      .filter(notNull)
      .filter((token) => token.token.chainMetadata.chainId === chainId)
      .map((colonyToken) => colonyToken.token) || [];

  const selectedToken =
    colonyTokens.find(
      (token) => token?.tokenAddress === selectedTokenAddress,
    ) || colonyTokens[0];

  const formattingOptions: FormatNumeralOptions = useMemo(
    () => ({
      delimiter: ',',
      numeralPositiveOnly: true,
      numeralDecimalScale: getTokenDecimalsWithFallback(
        selectedToken?.decimals,
      ),
    }),
    [selectedToken?.decimals],
  );

  return {
    colonyTokens,
    formattingOptions,
    selectedToken,
  };
};
