import { useColonyContext } from '~hooks';
import {
  getRequiredStake,
  getTotalStakeFraction,
  useGetVotingReputationData,
} from './helpers';

const useRequiredStake = (skillRep: string) => {
  const { colony } = useColonyContext();

  const { votingReputationData, loadingVotingReputationData } =
    useGetVotingReputationData(colony?.colonyAddress ?? '');

  const totalStakeFraction = getTotalStakeFraction(votingReputationData);
  const requiredStake = getRequiredStake(totalStakeFraction, skillRep);
  return {
    requiredStake,
    loadingRequiredStake: loadingVotingReputationData,
  };
};

export default useRequiredStake;
