import React from 'react';
import useClaimWidgetConfig from '~hooks/motionWidgets/claimWidget/useClaimWidgetConfig';

import DetailItem from '~shared/DetailsWidget/DetailItem';
import { MotionData } from '~types';

const displayName = `common.ColonyActions.ActionDetailsPage.DefaultMotion.ClaimMotionStakes`;

interface ClaimMotionStakesProps {
  motionData: MotionData;
}

const ClaimMotionStakes = ({ motionData }: ClaimMotionStakesProps) => {
  const config = useClaimWidgetConfig(motionData);

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
