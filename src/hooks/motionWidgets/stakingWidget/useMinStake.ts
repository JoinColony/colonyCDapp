import Decimal from 'decimal.js';
import { useColonyContext } from '~hooks';
import {
  getMinUserFraction,
  getMinUserStake,
  useGetVotingReputationData,
} from './helpers';

const useMinStake = (requiredStake: Decimal) => {
  const { colony } = useColonyContext();

  const { votingReputationData, loadingVotingReputationData } =
    useGetVotingReputationData(colony?.colonyAddress ?? '');

  const userMinStakeFraction = getMinUserFraction(votingReputationData);

  const minUserStake = getMinUserStake(userMinStakeFraction, requiredStake);

  return { loadingMinStake: loadingVotingReputationData, minUserStake };
};

export default useMinStake;
