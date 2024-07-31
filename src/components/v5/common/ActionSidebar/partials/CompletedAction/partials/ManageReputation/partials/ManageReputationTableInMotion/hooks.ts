import { BigNumber } from 'ethers';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useUserReputation from '~hooks/useUserReputation.ts';
import { calculatePercentageReputation } from '~utils/reputation.ts';
import {
  getFormattedTokenValue,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import { calculateNewValue } from '~v5/common/ActionSidebar/partials/forms/ManageReputationForm/partials/ManageReputationTable/utils.ts';

export const useManageReputationTableData = ({
  amount,
  member,
  domainId,
  isSmite,
}: {
  amount: string;
  member: string | undefined;
  domainId: number;
  isSmite?: boolean;
}) => {
  const { colony } = useColonyContext();
  const { colonyAddress, nativeToken } = colony;

  const {
    userReputation,
    totalReputation,
    loading: userReputationLoading,
  } = useUserReputation({
    colonyAddress,
    walletAddress: member,
    domainId,
  });

  const percentageReputation =
    calculatePercentageReputation(
      userReputation || '0',
      totalReputation || '0',
    ) || 0;

  const formattedReputationPoints = getFormattedTokenValue(
    BigNumber.from(userReputation || 0).toString(),
    getTokenDecimalsWithFallback(nativeToken.decimals, DEFAULT_TOKEN_DECIMALS),
  );

  const newReputation = calculateNewValue(userReputation, amount, isSmite);

  const newTotalReputation = calculateNewValue(
    totalReputation,
    amount,
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

  return {
    amountPercentageValue,
    formattedNewReputationPoints,
    formattedReputationPoints,
    newPercentageReputation,
    percentageReputation,
    isLoading: userReputationLoading,
  };
};
