import { type FormatNumeralOptions } from 'cleave-zen';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { useRef } from 'react';
import { useWatch } from 'react-hook-form';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useUserReputation from '~hooks/useUserReputation.ts';
import { getInputTextWidth } from '~utils/elements.ts';
import { getSafeStringifiedNumber } from '~utils/numbers.ts';
import {
  calculatePercentageReputation,
  getReputationDifference,
} from '~utils/reputation.ts';
import {
  getFormattedTokenValue,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import { ModificationOption } from '~v5/common/ActionSidebar/partials/forms/ManageReputationForm/consts.ts';

import { calculateNewValue } from './utils.ts';

export const useReputationAmountField = (maxWidth: number | undefined) => {
  const inputRef = useRef<HTMLInputElement>();
  const { colony } = useColonyContext();
  const { nativeToken } = colony;

  const formattingOptions: FormatNumeralOptions = {
    delimiter: ',',
    numeralPositiveOnly: true,
    numeralDecimalScale: getTokenDecimalsWithFallback(nativeToken.decimals),
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
  } = useUserReputation({
    colonyAddress,
    walletAddress: selectedUser,
    domainId,
  });

  const percentageReputation =
    calculatePercentageReputation(
      userReputation || '0',
      totalReputation || '0',
    ) || 0;

  const formattedReputationPoints = getFormattedTokenValue(
    BigNumber.from(userReputation || '0').toString(),
    getTokenDecimalsWithFallback(nativeToken.decimals),
  );

  const isSmite = selectedModification === ModificationOption.RemoveReputation;

  const amountValueCalculated = BigNumber.from(
    moveDecimal(
      getSafeStringifiedNumber(amount),
      getTokenDecimalsWithFallback(nativeToken.decimals),
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
    getTokenDecimalsWithFallback(nativeToken.decimals),
  );

  const amountPercentageValue = getReputationDifference(
    newPercentageReputation,
    percentageReputation,
  );

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
