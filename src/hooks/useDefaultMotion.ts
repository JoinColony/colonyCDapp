import { useState } from 'react';
import { ColonyAction } from '~types';
import useColonyContext from './useColonyContext';
import useEnabledExtensions from './useEnabledExtensions';

const useDefaultMotion = (motionData?: ColonyAction['motionData']) => {
  const { colony } = useColonyContext();

  const stakesUnder10Percent =
    Number(motionData?.motionStakes.percentage.yay) +
      Number(motionData?.motionStakes.percentage.nay) <
    10;

  const [showBanner, setShowBanner] = useState(stakesUnder10Percent);

  const {
    enabledExtensions: { isVotingReputationEnabled },
  } = useEnabledExtensions();

  return {
    showMotionHeading: isVotingReputationEnabled,
    showBanner,
    setShowBanner,
    colony,
  };
};

export default useDefaultMotion;
