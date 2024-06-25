import { Extension, Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';

import { ADDRESS_ZERO } from '~constants';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetUserReputationQuery } from '~gql';
import useEnoughTokensForStaking from '~hooks/useEnoughTokensForStaking.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

const useExpenditureStaking = (createdInDomainId = Id.RootDomain) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { walletAddress = '' } = user ?? {};

  const [stakeAmount, setStakeAmount] = useState<string>();

  const { data, loading: reputationLoading } = useGetUserReputationQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        colonyAddress: colony.colonyAddress,
        walletAddress: ADDRESS_ZERO,
        domainId: createdInDomainId,
      },
    },
  });
  const totalDomainReputation = data?.getUserReputation;

  const { extensionData, loading: extensionLoading } = useExtensionData(
    Extension.StakedExpenditure,
  );

  const {
    loadingUserTokenBalance,
    hasEnoughTokens,
    hasEnoughActivatedTokens,
    userActivatedTokens,
  } = useEnoughTokensForStaking({
    tokenAddress: colony.nativeToken.tokenAddress,
    walletAddress,
    colonyAddress: colony.colonyAddress,
    requiredStake: stakeAmount ?? '0',
  });

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
      .div(BigNumber.from(10).pow(colony.nativeToken.decimals))
      .toString();

    setStakeAmount(requiredAmount);
  }, [colony.nativeToken.decimals, extensionData, totalDomainReputation]);

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
    hasEnoughActivatedTokens,
    userActivatedTokens,
  };
};

export default useExpenditureStaking;
