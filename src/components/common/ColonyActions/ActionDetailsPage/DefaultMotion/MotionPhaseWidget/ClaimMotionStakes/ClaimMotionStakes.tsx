import React from 'react';

import DetailItem from '~shared/DetailsWidget/DetailItem';
import { MotionData } from '~types';
import { useClaimWidgetConfig } from '~hooks';

const displayName = `common.ColonyActions.ActionDetailsPage.DefaultMotion.ClaimMotionStakes`;

interface ClaimMotionStakesProps {
  motionData: MotionData;
  startPollingAction: (pollInterval: number) => void;
}

const ClaimMotionStakes = ({
  motionData,
  startPollingAction,
}: ClaimMotionStakesProps) => {
  const config = useClaimWidgetConfig(motionData, startPollingAction);

  return (
    <div>
      {config.map(({ label, item }) => (
        <DetailItem label={label} item={item} key={label} />
      ))}
    </div>
  );
};

ClaimMotionStakes.displayName = displayName;

export default ClaimMotionStakes;
