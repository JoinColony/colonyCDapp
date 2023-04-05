import { useLocation } from 'react-router-dom';
import { useEnoughTokensForStaking } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget/StakingInput/useEnoughTokensForStaking';

import { useGetColonyActionQuery } from '~gql';
import useAppContext from './useAppContext';

const getTransactionHashFromPathName = (pathname: string) =>
  pathname.split('/').pop();

const useStakingSlider = (isObjection: boolean) => {
  const { user, userLoading, walletConnecting } = useAppContext();
  const { pathname } = useLocation();
  const transactionHash = getTransactionHashFromPathName(pathname);
  const { data: actionData, loading: loadingActionData } =
    useGetColonyActionQuery({
      variables: {
        transactionHash: transactionHash ?? '',
      },
    });

  const motionData = actionData?.getColonyAction?.motionData;
  const nativeToken = actionData?.getColonyAction?.colony.nativeToken;

  if (!motionData) {
    throw new Error(
      "Unable to find motion data. This is a bug since we're only calling this hook from a motion.",
    );
  }

  if (!nativeToken) {
    throw new Error(
      "Unable to find colony data. This is a bug since we're only calling this hook from within a motion.",
    );
  }

  const {
    remainingStakes: [nayRemaining, yayRemaining],
    userMinStake,
    motionStakes: {
      percentage: { nay: nayPercentageStaked, yay: yayPercentageStaked },
    },
  } = motionData;

  const { nativeTokenDecimals, nativeTokenSymbol, tokenAddress } = nativeToken;

  const {
    enoughTokensToStakeMinimum,
    loadingUserTokenBalance,
    userActivatedTokens,
  } = useEnoughTokensForStaking(
    tokenAddress,
    user?.walletAddress ?? '',
    userMinStake,
  );

  const totalPercentageStaked =
    Number(nayPercentageStaked) + Number(yayPercentageStaked);

  return {
    remainingToStake: isObjection ? nayRemaining : yayRemaining,
    totalPercentageStaked,
    userMinStake,
    nativeTokenDecimals,
    nativeTokenSymbol,
    enoughTokensToStakeMinimum,
    userActivatedTokens,
    isLoadingData:
      loadingUserTokenBalance ||
      userLoading ||
      walletConnecting ||
      loadingActionData,
  };
};

export default useStakingSlider;
