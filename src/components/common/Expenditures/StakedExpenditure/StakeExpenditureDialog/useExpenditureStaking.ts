import { Extension } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';

import { ADDRESS_ZERO } from '~constants';
import { useGetUserReputationQuery } from '~gql';
import { useEnoughTokensForStaking, useExtensionData } from '~hooks';
import { Colony } from '~types';
import { isInstalledExtensionData } from '~utils/extensions';

const useExpenditureStaking = (
  colony: Colony,
  walletAddress: string,
  selectedDomainId: number,
) => {
  const [stakeAmount, setStakeAmount] = useState<string>();

  const { data, loading: reputationLoading } = useGetUserReputationQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        colonyAddress: colony.colonyAddress,
        walletAddress: ADDRESS_ZERO,
        domainId: selectedDomainId,
      },
    },
  });
  const totalDomainReputation = data?.getUserReputation;

  const { extensionData, loading: extensionLoading } = useExtensionData(
    Extension.StakedExpenditure,
  );

  const { loadingUserTokenBalance, hasEnoughTokens } =
    useEnoughTokensForStaking(
      colony.nativeToken.tokenAddress,
      walletAddress,
      colony.colonyAddress,
      stakeAmount ?? '0',
    );

  useEffect(() => {
    if (
      !totalDomainReputation ||
      !extensionData ||
      !isInstalledExtensionData(extensionData)
    ) {
      return;
    }

    const { stakeFraction } = extensionData.params?.stakedExpenditure || {};
    if (!stakeFraction) {
      return;
    }

    const requiredAmount = BigNumber.from(stakeFraction)
      .mul(totalDomainReputation)
      .div(BigNumber.from(10).pow(18))
      .toString();

    setStakeAmount(requiredAmount);
  }, [extensionData, totalDomainReputation]);

  const getStakedExpenditureAddress = () => {
    if (!extensionData || !isInstalledExtensionData(extensionData)) {
      return undefined;
    }

    return extensionData.address;
  };

  return {
    isLoading: loadingUserTokenBalance || reputationLoading || extensionLoading,
    stakeAmount,
    stakedExpenditureAddress: getStakedExpenditureAddress(),
    hasEnoughTokens,
  };
};

export default useExpenditureStaking;
