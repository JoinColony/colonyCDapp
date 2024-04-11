import { type FormatNumeralOptions } from 'cleave-zen';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { useRef } from 'react';
import { useWatch } from 'react-hook-form';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useUserReputation from '~hooks/useUserReputation.ts';
import { getInputTextWidth } from '~utils/elements.ts';
import { calculatePercentageReputation } from '~utils/reputation.ts';
import {
  getFormattedTokenValue,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';

import { ModificationOption } from '../../consts.ts';

import { calculateNewValue } from './utils.ts';

export const useReputationAmountField = (maxWidth: number | undefined) => {
  const inputRef = useRef<HTMLInputElement>();
  const { colony } = useColonyContext();
  const { nativeToken } = colony;

  const formattingOptions: FormatNumeralOptions = {
    delimiter: ',',
    numeralPositiveOnly: true,
    numeralDecimalScale: getTokenDecimalsWithFallback(
      nativeToken.decimals,
      DEFAULT_TOKEN_DECIMALS,
    ),
  };

  const adjustInputWidth = () => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.style.width = `${Math.min(
      getInputTextWidth(inputRef.current, { usePlaceholderAsFallback: true }),
      maxWidth || 120,
    )}px`;
  };

  return {
    inputRef,
    adjustInputWidth,
    formattingOptions,
  };
};

export const useReputationFields = () => {
  const {
    team: domainId,
    modification: selectedModification,
    member: selectedUser,
    amount,
  } = useWatch<{
    team: number;
    modification: string;
    member: string;
    amount: string;
  }>();
  const { colony } = useColonyContext();
  const { colonyAddress, nativeToken } = colony;

  const {
    userReputation,
    totalReputation,
    loading: userReputationLoading,
  } = useUserReputation(colonyAddress, selectedUser, domainId);

  const percentageReputation =
    calculatePercentageReputation(
      userReputation || '0',
      totalReputation || '0',
    ) || 0;

  const formattedReputationPoints = getFormattedTokenValue(
    BigNumber.from(userReputation || '0').toString(),
    getTokenDecimalsWithFallback(nativeToken.decimals, DEFAULT_TOKEN_DECIMALS),
  );

  const isSmite = selectedModification === ModificationOption.RemoveReputation;

  const amountValueCalculated = BigNumber.from(
    moveDecimal(
      amount || '0',
      getTokenDecimalsWithFallback(
        nativeToken.decimals,
        DEFAULT_TOKEN_DECIMALS,
      ),
    ),
  ).toString();

  const newReputation = calculateNewValue(
    userReputation,
    amountValueCalculated,
    isSmite,
  );

  const newTotalReputation = calculateNewValue(
    totalReputation,
    amountValueCalculated,
    isSmite,
  );

  const newPercentageReputation =
    calculatePercentageReputation(newReputation, newTotalReputation) || 0;

  const formattedNewReputationPoints = getFormattedTokenValue(
    newReputation || 0,
    getTokenDecimalsWithFallback(nativeToken.decimals, DEFAULT_TOKEN_DECIMALS),
  );

  const amountPercentageValue =
    typeof newPercentageReputation === 'number' &&
    typeof percentageReputation === 'number'
      ? Math.abs(newPercentageReputation - percentageReputation)
      : '~0';

  const newValueIsGreaterThanZero = isSmite
    ? BigNumber.from(userReputation || '0').gte(amountValueCalculated)
    : true;

  return {
    userReputationLoading,
    formattedReputationPoints,
    percentageReputation,
    formattedNewReputationPoints,
    newPercentageReputation,
    amountPercentageValue,
    newValueIsGreaterThanZero,
  };
};
