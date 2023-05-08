import React from 'react';

import DetailItem from '~shared/DetailsWidget/DetailItem';
import { ColonyMotion } from '~types';

import useClaimWidgetConfig from './useClaimWidgetConfig';
import styles from './ClaimMotionStakes.css';

const displayName = `common.ColonyActions.ActionDetailsPage.DefaultMotion.ClaimMotionStakes`;

interface ClaimMotionStakesProps {
  motionData: ColonyMotion;
  startPollingAction: (pollInterval: number) => void;
}

export type ClaimMotionStakesStyles = typeof styles;

const ClaimMotionStakes = ({
  motionData,
  startPollingAction,
}: ClaimMotionStakesProps) => {
  const config = useClaimWidgetConfig(motionData, startPollingAction, styles);

  return (
    <div>
      {config.map(({ label, labelStyles, item }) => (
        <DetailItem
          label={label}
          labelStyles={labelStyles}
          item={item}
          key={label as string} // safe casting as we don't interpolate complex values in useClaimWidgetConfig
        />
      ))}
    </div>
  );
};

ClaimMotionStakes.displayName = displayName;

export default ClaimMotionStakes;
