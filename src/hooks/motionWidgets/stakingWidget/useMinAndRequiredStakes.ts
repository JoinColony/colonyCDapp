import { Extension, getExtensionHash } from '@colony/colony-js';
import Decimal from 'decimal.js';

import { useGetColonyExtensionQuery } from '~gql';
import useColonyContext from '~hooks/useColonyContext';

const useMinAndRequiredStakes = (skillRep: string) => {
  const { colony } = useColonyContext();

  const { data: votingReputationData, loading } = useGetColonyExtensionQuery({
    variables: {
      colonyAddress: colony?.colonyAddress ?? '',
      extensionHash: getExtensionHash(Extension.VotingReputation),
    },
  });

  const userMinStakeFraction =
    votingReputationData?.getExtensionByColonyAndHash?.items[0]?.extensionConfig
      ?.minimumStake ?? '1';

  const totalStakeFraction =
    votingReputationData?.getExtensionByColonyAndHash?.items[0]?.extensionConfig
      ?.requiredStake ?? '1';

  const totalStakeFractionPercentage = new Decimal(totalStakeFraction).div(
    new Decimal(10).pow(18).toString(),
  );

  const userMinStakeFractionPercentage = new Decimal(userMinStakeFraction).div(
    new Decimal(10).pow(18).toString(),
  );

  const requiredStake = new Decimal(skillRep).mul(totalStakeFractionPercentage);

  /*
   * The amount of the required stake each user must stake as a minimum.
   * E.g. if the required stake is 1% of the domain rep, and the min user stake is 1%, then it will be:
   * 1% of 1% of the total domain rep.
   */
  const minUserStake = requiredStake.mul(userMinStakeFractionPercentage);

  return { minUserStake, requiredStake, loadingStakeData: loading };
};

export default useMinAndRequiredStakes;
